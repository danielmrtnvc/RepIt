// OpenAI Assistant integration

import OpenAI from 'openai';
import { WorkoutRequest, Exercise } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // For client-side usage (MVP only)
});

const ASSISTANT_ID = import.meta.env.VITE_OPENAI_ASSISTANT_ID;

/**
 * Generate a workout using OpenAI Assistant
 * Returns a list of exercises
 */
export async function generateWorkout(request: WorkoutRequest): Promise<Exercise[]> {
  try {
    // Create a thread
    const thread = await openai.beta.threads.create();

    // Build the message content
    const messageContent = buildPrompt(request);

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: messageContent,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
        throw new Error(`Assistant run ${runStatus.status}`);
      }
      
      // Wait 1 second before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];

    if (!lastMessage || lastMessage.role !== 'assistant') {
      throw new Error('No response from assistant');
    }

    // Extract text from the message
    const content = lastMessage.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    const responseText = content.text.value;

    // Parse the response into exercises
    return parseWorkoutResponse(responseText);
  } catch (error) {
    console.error('Failed to generate workout:', error);
    throw new Error('Could not generate workout. Please try again.');
  }
}

/**
 * Build a prompt for the assistant
 */
function buildPrompt(request: WorkoutRequest): string {
  let prompt = `Generate a ${request.workoutType} workout`;
  
  if (request.equipment.length > 0) {
    prompt += ` using: ${request.equipment.join(', ')}`;
  }
  
  if (request.context) {
    prompt += `\n\nAdditional context: ${request.context}`;
  }

  prompt += '\n\nPlease provide a structured workout with exercises. For each exercise include: name, sets, reps (or duration), and any relevant notes.';
  
  return prompt;
}

/**
 * Parse the assistant's response into Exercise objects
 * This is a simple parser - assumes the assistant returns structured data
 * In production, you'd want the assistant to return JSON
 */
function parseWorkoutResponse(responseText: string): Exercise[] {
  // For MVP, we'll do simple parsing
  // Assume format like:
  // 1. Exercise Name - 3 sets x 10 reps
  // 2. Another Exercise - 4 sets x 12 reps
  
  const exercises: Exercise[] = [];
  const lines = responseText.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    // Match numbered lines: "1. Exercise - details"
    const match = line.match(/^\d+\.\s*(.+?)(?:\s*-\s*(.+))?$/);
    
    if (match) {
      const name = match[1].trim();
      const details = match[2]?.trim() || '';
      
      // Try to extract sets/reps
      const setsRepsMatch = details.match(/(\d+)\s*sets?\s*x\s*(\d+)\s*reps?/i);
      const durationMatch = details.match(/(\d+)\s*(min|minutes|sec|seconds)/i);
      
      exercises.push({
        id: crypto.randomUUID(),
        name,
        sets: setsRepsMatch ? setsRepsMatch[1] : undefined,
        reps: setsRepsMatch ? setsRepsMatch[2] : undefined,
        duration: durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : undefined,
        notes: details,
        completed: false,
      });
    }
  }
  
  // If parsing failed, create a simple fallback
  if (exercises.length === 0) {
    // Split by double newlines or periods
    const parts = responseText.split(/\n\n|\. /).filter(p => p.trim());
    
    parts.forEach((part, index) => {
      if (part.trim()) {
        exercises.push({
          id: crypto.randomUUID(),
          name: part.trim().substring(0, 100),
          completed: false,
        });
      }
    });
  }
  
  return exercises;
}

