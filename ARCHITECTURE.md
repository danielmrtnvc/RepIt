# Architecture Overview

## System Design

RepIt follows a simple, single-page application (SPA) architecture with no backend. All logic runs in the browser, and all data is stored in localStorage.

## Component Hierarchy

```
App (Root)
├── WorkoutHistory (History view)
│   └── WorkoutCard (Individual workout item)
├── WorkoutForm (Generate view)
│   ├── Text Input (Context)
│   ├── Select (Workout Type)
│   └── Multi-select (Equipment)
└── WorkoutChecklist (Checklist view)
    └── ExerciseItem (Individual exercise)
```

## Data Flow

### 1. Workout Generation Flow

```
User fills form
    ↓
WorkoutForm component
    ↓
handleGenerateWorkout() in App
    ↓
generateWorkout() API call (utils/openai.ts)
    ↓
Create Workout object
    ↓
saveWorkout() to localStorage (utils/storage.ts)
    ↓
Update App state
    ↓
Navigate to WorkoutChecklist view
```

### 2. Exercise Completion Flow

```
User clicks exercise checkbox
    ↓
ExerciseItem component
    ↓
handleExerciseToggle() in WorkoutChecklist
    ↓
Update exercise.completed
    ↓
updateWorkout() in localStorage (utils/storage.ts)
    ↓
Update App state
    ↓
Re-render WorkoutChecklist
```

### 3. Finish Workout Flow

```
User clicks "Finish Workout"
    ↓
handleFinishWorkout() in WorkoutChecklist
    ↓
Validate all exercises completed
    ↓
Add completedAt timestamp
    ↓
updateWorkout() in localStorage
    ↓
Navigate back to WorkoutHistory
```

## State Management

### App-Level State

```typescript
const [view, setView] = useState<View>('history')
const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null)
const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

**Why in App component?**
- Simple, centralized state for MVP
- No prop drilling needed (max 2 levels)
- Easy to debug and understand
- Can migrate to Context/Redux later if needed

### Component-Level State

Each form component manages its own input state:
- `WorkoutForm`: context, workoutType, selectedEquipment
- No other components need local state

## Storage Layer

### localStorage Schema

```javascript
{
  "repit_workout_history": {
    "workouts": [
      {
        "id": "uuid",
        "date": "2024-01-15T10:30:00.000Z",
        "workoutType": "push",
        "equipment": ["dumbbells", "bodyweight"],
        "context": "quick upper body",
        "exercises": [
          {
            "id": "uuid",
            "name": "Push-ups",
            "sets": "3",
            "reps": "15",
            "notes": "Focus on form",
            "completed": true
          }
        ],
        "completedAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
}
```

### Storage Operations

All storage operations are in `src/utils/storage.ts`:

- `getWorkoutHistory()` - Read all workouts
- `saveWorkout(workout)` - Add new workout
- `updateWorkout(id, workout)` - Update existing workout
- `getWorkoutById(id)` - Get single workout
- `deleteWorkout(id)` - Remove workout (optional)

**Why localStorage?**
- Simple, no backend needed
- Synchronous API (no async complexity)
- Sufficient for MVP (single user, single device)
- 5-10MB limit is plenty for workout data

## API Integration

### OpenAI Assistant Flow

```
User submits form
    ↓
buildPrompt() creates message text
    ↓
Create thread (openai.beta.threads.create)
    ↓
Add message to thread
    ↓
Run assistant
    ↓
Poll for completion (1 sec intervals)
    ↓
Get assistant's response
    ↓
parseWorkoutResponse() extracts exercises
    ↓
Return Exercise[] array
```

### Error Handling

```typescript
try {
  const exercises = await generateWorkout(request)
  // Success path
} catch (error) {
  // Show error to user
  setError('Could not generate workout. Please try again.')
}
```

**Failure scenarios**:
- Invalid API key → Show error message
- Network failure → Show error message
- Assistant timeout → Show error message
- Parse failure → Return fallback exercises

## View Routing

### Simple State-Based Routing

```typescript
type View = 'history' | 'form' | 'checklist'
```

**Why not React Router?**
- Only 3 views, no nested routes
- No URL params needed
- Simpler for MVP
- Can add router later if needed

### View Transitions

```
history → form (New Workout button)
form → checklist (After generation)
checklist → history (Finish Workout or Back)
history → checklist (Select past workout)
```

## Styling Strategy

### Tailwind Utility-First

```tsx
<button className="w-full py-4 bg-blue-600 text-white rounded-lg">
  Generate Workout
</button>
```

**Why Tailwind?**
- Mobile-first by default
- No CSS files to manage
- Consistent spacing/colors
- Small bundle size with purging

### Mobile-First Approach

```css
/* Base styles = mobile */
.button { padding: 1rem; }

/* Desktop overrides */
@media (min-width: 768px) {
  .button { padding: 0.75rem; }
}
```

**Key mobile optimizations**:
- Large touch targets (44px minimum)
- Single column layouts
- Sticky header
- Bottom buttons easy to reach

## Type Safety

### TypeScript Types

All types defined in `src/types.ts`:

```typescript
// Discriminated unions for workout types
type WorkoutType = 'push' | 'pull' | 'legs' | ...

// Equipment options
type Equipment = 'bodyweight' | 'barbell' | ...

// Core data models
interface Workout { ... }
interface Exercise { ... }
interface WorkoutRequest { ... }
```

**Benefits**:
- Catch errors at compile time
- IntelliSense in editor
- Self-documenting code
- Refactoring safety

## Performance Considerations

### MVP Optimizations

1. **No unnecessary re-renders**
   - State updates are minimal
   - No computed values in render

2. **localStorage is synchronous**
   - No loading states needed
   - Instant updates

3. **Small bundle size**
   - React 18 automatic batching
   - Tailwind purges unused CSS
   - Vite tree-shaking

### Future Optimizations (Not MVP)

- ❌ Code splitting (app is small)
- ❌ Memoization (no expensive computations)
- ❌ Virtual scrolling (history won't be huge)
- ❌ Service worker (no offline requirement)

## Extensibility

### Easy to Add Later

**Backend API**:
- Replace `utils/storage.ts` with API calls
- Keep same interface, just make async

**Authentication**:
- Add auth provider at App level
- Wrap routes with auth check

**More Views**:
- Add to View type
- Add case in App render

**Analytics**:
- Add tracking calls in event handlers

**Exercise Library**:
- Create new `exercises.ts` utility
- Add autocomplete to form

## Security

### Current Approach (MVP)

- API key in browser (acceptable for MVP)
- No user data leaves device
- No XSS risk (React escapes by default)

### Production Considerations

⚠️ **Do not deploy with browser API key**

**Recommendation**:
1. Create backend proxy (Next.js API route, serverless function)
2. Move API key to backend
3. Add rate limiting
4. Add request validation

## Testing Strategy (Out of Scope)

For future expansion:
- Unit tests: storage utils, parsing logic
- Integration tests: form submission, workout flow
- E2E tests: complete user journey

## Deployment

### Build Output

```bash
npm run build
→ dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   └── index-[hash].css
  └── ...
```

### Hosting Options

- **Vercel**: Zero config, automatic HTTPS
- **Netlify**: Drag & drop deploy
- **GitHub Pages**: Free static hosting
- **S3 + CloudFront**: AWS option

All options work since it's a static SPA.

## Architectural Principles

1. **Simplicity First**: No over-engineering
2. **Mobile-First**: Design for phone, enhance for desktop
3. **Type Safety**: TypeScript prevents bugs
4. **Local-First**: Data stays on device
5. **Progressive Enhancement**: Works without JavaScript for HTML content

---

This architecture supports the MVP goals while remaining flexible for future expansion.

