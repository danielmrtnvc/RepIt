# Troubleshooting Guide

## Network Access Issues

### Error: "Could not generate workout" on Local Network (192.168.x.x)

**Symptom**: The app works fine on `localhost` but fails with "Could not generate workout. Please try again." when accessed via local network IP (e.g., `http://192.168.2.110:5173`)

**Cause**: The OpenAI API has CORS (Cross-Origin Resource Sharing) restrictions. When using `dangerouslyAllowBrowser: true`, the OpenAI SDK makes direct requests from the browser to OpenAI's servers. OpenAI's CORS policy allows `localhost` but may block requests from other origins like local IP addresses.

**Solutions**:

#### Solution 1: Use localhost (Recommended for Development)

Access the app using `http://localhost:5173` on the device running the dev server.

For testing on mobile devices on the same network, see Solution 2 or 3.

#### Solution 2: Check Browser Console for Detailed Error

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try generating a workout
4. Look for the actual error message (you'll now see detailed logs)
5. Common errors:
   - **CORS error**: OpenAI blocking the request (see Solution 3)
   - **"Missing VITE_OPENAI_API_KEY"**: Environment variables not loaded (restart dev server)
   - **"Invalid API key"**: Check your `.env` file
   - **Network error**: Check internet connection

#### Solution 3: Add Backend Proxy (Production Solution)

For production or testing on mobile, you should use a backend proxy instead of calling OpenAI directly from the browser.

**Option A: Quick Fix with Vite Proxy** (Development Only)

This won't work for OpenAI API because it requires authentication, but here's the approach:

Create a simple backend endpoint that proxies requests to OpenAI. You can use:
- Next.js API routes
- Express.js server
- Netlify/Vercel serverless functions

**Option B: Use ngrok or similar tunnel** (Testing on Mobile)

1. Install ngrok: `npm install -g ngrok`
2. Run your dev server: `npm run dev`
3. In another terminal: `ngrok http 5173`
4. Use the ngrok HTTPS URL on your mobile device

The ngrok HTTPS URL should work because OpenAI allows HTTPS origins.

#### Solution 4: Temporary Workaround - Modify OpenAI Client

Add default headers to potentially bypass some restrictions:

```typescript
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'Origin': 'http://localhost:5173'
  }
});
```

⚠️ **Warning**: This is a hack and may not work. OpenAI uses the actual browser origin, not the header.

---

## Other Common Issues

### Environment Variables Not Loading

**Symptom**: Error messages about missing API key or Assistant ID

**Solutions**:
1. Ensure `.env` file exists in the root directory
2. Restart the dev server after creating/modifying `.env`
3. Check that variables start with `VITE_` prefix
4. Verify no extra spaces or quotes in `.env` file

### localStorage Not Working

**Symptom**: Workouts don't save or history is empty

**Solutions**:
1. Don't use incognito/private browsing mode
2. Check browser settings allow localStorage
3. Clear browser cache and try again
4. Try a different browser

### Assistant Returns Unformatted Responses

**Symptom**: Exercises don't parse correctly, weird display

**Solutions**:
1. Update your Assistant instructions (see `OPENAI_ASSISTANT_INSTRUCTIONS.md`)
2. Emphasize the numbered list format in instructions
3. Test your assistant in OpenAI Playground before using in the app

### Build Errors

**Symptom**: TypeScript errors or build fails

**Solutions**:
```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (needs 18+)
node --version

# Clear Vite cache
rm -rf node_modules/.vite
```

### Slow Workout Generation

**Symptom**: Takes more than 10-15 seconds to generate

**Possible Causes**:
- OpenAI API experiencing high load
- Network latency
- Assistant using a slower model

**Solutions**:
- Wait it out (usually completes within 30 seconds)
- Check OpenAI status: https://status.openai.com/
- Ensure you're using GPT-4 Turbo (faster than GPT-4)

---

## Production Deployment Issues

### API Key Exposed in Browser

**Warning**: When you deploy this app, your API key is visible in the browser's JavaScript bundle.

**Solution**:
1. Create a backend API endpoint
2. Move OpenAI calls to the backend
3. Keep API key on the server only
4. Update frontend to call your backend instead

Example backend structure:
```
POST /api/generate-workout
Body: { workoutType, equipment, context }
Response: { exercises: [...] }
```

### Rate Limiting

**Symptom**: Frequent "Too Many Requests" errors

**Solutions**:
1. Implement request throttling in the frontend
2. Add rate limiting on your backend
3. Upgrade your OpenAI plan
4. Cache common workout types

---

## Getting Help

If none of these solutions work:

1. Check the browser console for detailed error messages (now enabled)
2. Check OpenAI API status: https://status.openai.com/
3. Verify your API key works in OpenAI Playground
4. Open an issue with:
   - Full error message from console
   - Steps to reproduce
   - Your setup (browser, device, network)

## Debugging Tips

### Enable Verbose Logging

The app now logs detailed information to the console:
- Workout request details
- Thread creation
- Assistant run status
- Parsing results

Open DevTools → Console to see these logs.

### Test OpenAI Connection Manually

```javascript
// In browser console
console.log('API Key exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
console.log('Assistant ID exists:', !!import.meta.env.VITE_OPENAI_ASSISTANT_ID);
```

### Check localStorage

```javascript
// In browser console
localStorage.getItem('repit_workout_history');
```

---

## Known Limitations (MVP)

These are expected limitations for the MVP:

- ❌ No offline support
- ❌ Single device only (no sync)
- ❌ API key visible in browser (dev only)
- ❌ No backup/export functionality
- ❌ Network IP access may have CORS issues

For production deployment, implement a proper backend.

