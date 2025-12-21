# Contributing to RepIt

## MVP Principles

RepIt is designed as a **Minimum Viable Product**. When contributing, always ask:

1. Does this serve the core use case?
2. Is this the simplest solution?
3. Will this add unnecessary complexity?

## Non-Goals

Please **DO NOT** submit PRs for:
- Authentication systems
- Backend databases
- Social features
- Analytics dashboards
- Complex animations
- Workout timers
- Exercise videos
- Progress charts

These are explicitly out of scope for the MVP.

## What to Contribute

### Welcome Contributions

- Bug fixes
- Mobile UX improvements
- Accessibility enhancements
- Code clarity/refactoring
- Documentation improvements
- TypeScript type improvements
- Error handling improvements
- OpenAI parsing robustness

### Before You Start

1. Open an issue describing the problem/improvement
2. Wait for maintainer feedback
3. Fork and create a branch
4. Make your changes
5. Test on mobile and desktop
6. Submit a PR with clear description

## Code Style

### TypeScript

- Use strict mode
- Define all types explicitly
- No `any` types
- Prefer interfaces over types for objects

### React

- Functional components only
- Use TypeScript for props
- Keep components simple
- Avoid premature optimization

### Styling

- Use Tailwind utilities
- Mobile-first approach
- Keep classes inline
- No custom CSS unless necessary

### File Organization

```
src/
├── components/     # React components (one per file)
├── utils/         # Pure functions, no React
└── types.ts       # All TypeScript types
```

## Testing Checklist

Before submitting a PR, verify:

- [ ] Works on mobile (iPhone/Android)
- [ ] Works on desktop
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console errors
- [ ] localStorage persists correctly
- [ ] Error states display properly
- [ ] Loading states work
- [ ] Back button works correctly

## Commit Messages

Use clear, descriptive commits:

```
✅ Fix exercise checkbox touch target size
✅ Add error handling for OpenAI timeout
✅ Improve workout card mobile layout
❌ misc fixes
❌ update stuff
```

## PR Guidelines

### Title

```
Fix: Exercise checkboxes too small on iOS
Add: Error retry button
Improve: Workout form validation
Refactor: Extract storage utilities
Docs: Add deployment guide
```

### Description Template

```markdown
## Problem
Brief description of the issue

## Solution
How this PR fixes it

## Testing
- [ ] Tested on iOS Safari
- [ ] Tested on Android Chrome
- [ ] Tested on desktop
- [ ] No TypeScript errors
- [ ] localStorage works correctly

## Screenshots
(if UI changes)
```

## Architecture Decisions

When making changes, follow these principles:

### State Management
- Keep state in App component
- No Redux/Context unless absolutely needed
- Props are acceptable for 2 levels

### API Calls
- All OpenAI logic in `utils/openai.ts`
- Handle errors gracefully
- Show user-friendly messages

### Storage
- All localStorage logic in `utils/storage.ts`
- Keep data structure flat
- Use UUIDs for IDs

### Routing
- Simple state-based routing
- No React Router for MVP
- Three views: history, form, checklist

## Questions?

Open an issue for:
- Feature proposals (but remember MVP scope!)
- Bug reports
- Architecture questions
- Setup problems

## License

By contributing, you agree your contributions will be licensed under MIT.

