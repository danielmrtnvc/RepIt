// localStorage utility for workout persistence

import { Workout, WorkoutHistory } from '../types';

const STORAGE_KEY = 'repit_workout_history';

/**
 * Get all workouts from localStorage
 */
export function getWorkoutHistory(): WorkoutHistory {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { workouts: [] };
    }
    return JSON.parse(data) as WorkoutHistory;
  } catch (error) {
    console.error('Failed to load workout history:', error);
    return { workouts: [] };
  }
}

/**
 * Save a new workout to localStorage
 */
export function saveWorkout(workout: Workout): void {
  try {
    const history = getWorkoutHistory();
    history.workouts.push(workout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save workout:', error);
    throw new Error('Could not save workout');
  }
}

/**
 * Update an existing workout (e.g., when exercises are checked/unchecked)
 */
export function updateWorkout(workoutId: string, updatedWorkout: Workout): void {
  try {
    const history = getWorkoutHistory();
    const index = history.workouts.findIndex((w) => w.id === workoutId);
    
    if (index === -1) {
      throw new Error('Workout not found');
    }
    
    history.workouts[index] = updatedWorkout;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to update workout:', error);
    throw new Error('Could not update workout');
  }
}

/**
 * Get a single workout by ID
 */
export function getWorkoutById(workoutId: string): Workout | null {
  const history = getWorkoutHistory();
  return history.workouts.find((w) => w.id === workoutId) || null;
}

/**
 * Delete a workout (optional feature for future)
 */
export function deleteWorkout(workoutId: string): void {
  try {
    const history = getWorkoutHistory();
    history.workouts = history.workouts.filter((w) => w.id !== workoutId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to delete workout:', error);
    throw new Error('Could not delete workout');
  }
}

