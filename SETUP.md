# Setup Guide

## Quick Start

Follow these steps to get RepIt running locally:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI Assistant

#### Create an Assistant

1. Visit [OpenAI Platform - Assistants](https://platform.openai.com/assistants)
2. Click "Create" to make a new Assistant
3. Configure the assistant:

**Name**: Workout Generator

**Instructions**:
```
You are a professional fitness trainer and workout designer. When a user requests a workout, you should generate a structured workout plan based on their requirements.

Your response should be a numbered list of exercises. For each exercise, include:
- Exercise name
- Sets and reps (e.g., "3 sets x 10 reps") OR duration (e.g., "30 seconds")
- Brief notes if relevant (e.g., "focus on form", "keep core tight")

Format each exercise like this:
1. Push-ups - 3 sets x 15 reps
2. Plank - 3 sets x 30 seconds - Keep core engaged
3. Squats - 4 sets x 12 reps

Consider:
- The workout type (push, pull, legs, cardio, HIIT, arms, full body, stretching)
- Available equipment (bodyweight, barbell, dumbbells, resistance bands, pullup bar, jump rope)
- Any additional context provided by the user (e.g., "short workout", "knee friendly", "strength focused")

Provide appropriate exercises that match the workout type and available equipment. Adjust intensity and volume based on context clues. Aim for 5-8 exercises per workout.
```

**Model**: GPT-4 or GPT-4 Turbo (recommended)

4. Click "Save"
5. Copy the Assistant ID (starts with `asst_...`)

#### Get Your API Key

1. Visit [OpenAI Platform - API Keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name (e.g., "RepIt Local Dev")
4. Copy the key immediately (you won't see it again!)

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` and add your credentials:

```
VITE_OPENAI_API_KEY=sk-...your_key_here
VITE_OPENAI_ASSISTANT_ID=asst_...your_assistant_id_here
```

⚠️ **Security Note**: Never commit `.env` to version control. It's already in `.gitignore`.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 5. Test the App

1. Click "Generate Your First Workout" or "New Workout"
2. Fill out the form:
   - Context: "quick upper body workout"
   - Workout Type: "push"
   - Equipment: "dumbbells", "bodyweight"
3. Click "Generate Workout"
4. Check off exercises as you complete them
5. Click "Finish Workout" when done
6. View your workout history

## Troubleshooting

### "Could not generate workout" Error

**Cause**: OpenAI API key or Assistant ID is incorrect/missing

**Solution**:
- Check your `.env` file exists and has both values
- Verify the API key starts with `sk-`
- Verify the Assistant ID starts with `asst_`
- Restart the dev server after changing `.env`

### Assistant Returns Poorly Formatted Exercises

**Cause**: Assistant instructions may need refinement

**Solution**:
- Edit your Assistant in the OpenAI Platform
- Update the instructions to be more specific about formatting
- Test with clearer prompts

### localStorage Not Working

**Cause**: Browser privacy settings or incognito mode

**Solution**:
- Use a standard browser window (not incognito)
- Check browser settings allow localStorage
- Try a different browser

### Build Errors

**Cause**: Missing dependencies or outdated Node.js

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update Node.js to 18+
node --version
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub (without `.env`)
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_OPENAI_API_KEY`
   - `VITE_OPENAI_ASSISTANT_ID`
5. Deploy

⚠️ **Important**: Using the OpenAI API in the browser exposes your API key. For production, consider adding a backend proxy.

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```
2. Upload the `dist/` folder to Netlify
3. Configure environment variables in Netlify dashboard

## Development Tips

### Hot Reload

Vite provides instant hot reload. Just save your files and see changes immediately.

### TypeScript

All types are defined in `src/types.ts`. The project uses strict TypeScript for safety.

### Tailwind CSS

Use Tailwind utility classes for styling. The mobile-first approach means styles apply to mobile by default.

### Debugging

- Check browser console for errors
- Use React DevTools to inspect component state
- localStorage data is viewable in DevTools → Application → Local Storage

## API Usage & Costs

Each workout generation makes:
- 1 thread creation
- 1 message
- 1 run

Estimated cost per workout: ~$0.01-0.05 depending on model and response length.

Monitor usage at [OpenAI Platform - Usage](https://platform.openai.com/usage)

## Next Steps

Once everything works:
1. Customize the Assistant instructions for your needs
2. Test with different workout types
3. Build out your workout history
4. Consider adding a backend for production use

---

Need help? Check the main [README.md](README.md) for project overview and architecture details.

