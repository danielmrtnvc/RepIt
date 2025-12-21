# RepIt - Workout Web App

A minimal, mobile-first workout web app that helps you generate and track workouts using AI.

## Features

- 🏋️ **Generate Workouts**: Create custom workouts using OpenAI Assistant based on workout type, equipment, and context
- ✅ **Track Progress**: Check off exercises as you complete them with a simple checklist interface
- 📊 **View History**: See all your past workouts and their completion status
- 💾 **Local Storage**: All data stored locally in your browser (no backend required)
- 📱 **Mobile-First**: Optimized for mobile devices with large touch targets

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Mobile-first styling
- **OpenAI API** - Workout generation via Assistant API
- **localStorage** - Data persistence

## Project Structure

```
RepIt/
├── src/
│   ├── components/           # React components
│   │   ├── WorkoutForm.tsx   # Form to generate workouts
│   │   ├── WorkoutChecklist.tsx  # Display & check exercises
│   │   └── WorkoutHistory.tsx    # List past workouts
│   ├── utils/               # Utility functions
│   │   ├── openai.ts        # OpenAI Assistant integration
│   │   └── storage.ts       # localStorage operations
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind config
└── vite.config.ts           # Vite config
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- OpenAI Assistant ID (create one in the OpenAI platform)

### Installation

1. **Clone the repository**
   ```bash
   cd RepIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_ASSISTANT_ID=your_assistant_id_here
   VITE_SITE_PASSWORD=your_secure_password_here
   ```

4. **Create an OpenAI Assistant**
   
   - Go to [OpenAI Platform](https://platform.openai.com/assistants)
   - Create a new Assistant
   - Give it instructions like:
     ```
     You are a fitness expert. When asked to generate a workout, provide a list of exercises with sets, reps, and any relevant notes. Format your response as a numbered list where each line contains:
     1. Exercise Name - Details (e.g., "3 sets x 10 reps" or "30 seconds")
     
     Consider the workout type, available equipment, and any additional context provided.
     ```
   - Copy the Assistant ID and add it to your `.env` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:5173`

## Usage Flow

1. **Generate a Workout**
   - Enter optional context (e.g., "short workout", "knee friendly")
   - Select workout type (push, pull, legs, etc.)
   - Select available equipment
   - Click "Generate Workout"

2. **Complete Exercises**
   - Check off each exercise as you complete it
   - Progress bar shows your completion percentage
   - Click "Finish Workout" when done

3. **View History**
   - See all past workouts sorted by date
   - Click any workout to view details
   - Green badge indicates completed workouts

## Data Models

### WorkoutRequest
```typescript
interface WorkoutRequest {
  context?: string;           // Optional context
  workoutType: WorkoutType;   // Single-select type
  equipment: Equipment[];     // Multi-select equipment
}
```

### Workout
```typescript
interface Workout {
  id: string;
  date: string;               // ISO timestamp
  workoutType: WorkoutType;
  equipment: Equipment[];
  context?: string;
  exercises: Exercise[];
  completedAt?: string;       // ISO timestamp when finished
}
```

### Exercise
```typescript
interface Exercise {
  id: string;
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
  completed: boolean;
}
```

## Design Decisions

### Why Frontend-Only?
This is an MVP focused on core functionality. A backend would add complexity without immediate value. localStorage provides sufficient persistence for a single-user app.

### Why OpenAI Assistant?
The Assistant API provides a clean abstraction for generating workouts. We treat it as a black box and focus on the user experience. The assistant prompt can be refined independently.

### Why No Authentication?
Authentication is unnecessary for an MVP with local storage. Each user's data stays on their device.

### Why Mobile-First?
Most workout apps are used on mobile devices. Tailwind CSS makes responsive design straightforward.

## Future Enhancements (Out of Scope for MVP)

- ❌ User authentication
- ❌ Backend database
- ❌ Social features
- ❌ Analytics
- ❌ Workout timers
- ❌ Exercise animations
- ❌ Progress charts

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder ready for deployment.

## Browser Support

- Modern browsers with localStorage support
- Chrome, Firefox, Safari, Edge (latest versions)
- iOS Safari 12+
- Android Chrome 80+

### Network Access Note

⚠️ **Important for Mobile Testing**: Due to OpenAI API CORS restrictions, the app works best when accessed via `http://localhost:5173`. If you need to test on a mobile device on your local network:

1. **Option 1**: Use [ngrok](https://ngrok.com/) to create an HTTPS tunnel (recommended)
   ```bash
   ngrok http 5173
   ```
   Then access the ngrok HTTPS URL on your mobile device.

2. **Option 2**: Build and deploy to a hosting service (Vercel, Netlify)

See `TROUBLESHOOTING.md` for detailed information about network access issues.

## License

MIT

## Contributing

This is an MVP project. Focus on simplicity and core functionality. Avoid feature creep.
