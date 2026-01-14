// localStorage utility for workout persistence

import { Workout, WorkoutHistory, UserGoals, UserProgress } from '../types';

const STORAGE_KEY = 'repit_workout_history';
const GOALS_STORAGE_KEY = 'repit_user_goals';
const PROGRESS_STORAGE_KEY = 'repit_user_progress';

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

/**
 * Get user goals from localStorage
 */
export function getUserGoals(): UserGoals {
  try {
    const data = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!data) {
      // Default goals
      return {
        benchPress: 200,
        militaryPress: 135,
        deadlift: 300,
        bicepCurl: 50,
        squat: 225,
        plank: 120,
      };
    }
    return JSON.parse(data) as UserGoals;
  } catch (error) {
    console.error('Failed to load user goals:', error);
    return {
      benchPress: 200,
      militaryPress: 135,
      deadlift: 300,
      bicepCurl: 50,
      squat: 225,
      plank: 120,
    };
  }
}

/**
 * Save user goals to localStorage
 */
export function saveUserGoals(goals: UserGoals): void {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save user goals:', error);
    throw new Error('Could not save user goals');
  }
}

/**
 * Get user progress from localStorage
 */
export function getUserProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!data) {
      // Default progress (starting point)
      return {
        benchPress: 100,
        militaryPress: 65,
        deadlift: 150,
        bicepCurl: 25,
        squat: 115,
        plank: 60,
      };
    }
    return JSON.parse(data) as UserProgress;
  } catch (error) {
    console.error('Failed to load user progress:', error);
    return {
      benchPress: 100,
      militaryPress: 65,
      deadlift: 150,
      bicepCurl: 25,
      squat: 115,
      plank: 60,
    };
  }
}

/**
 * Save user progress to localStorage
 */
export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save user progress:', error);
    throw new Error('Could not save user progress');
  }
}

