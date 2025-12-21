// Core data models for the workout app

export type WorkoutType =
  | 'push'
  | 'pull'
  | 'legs'
  | 'cardio'
  | 'HIIT'
  | 'arms'
  | 'full body'
  | 'stretching';

export type Equipment =
  | 'bodyweight'
  | 'barbell'
  | 'dumbbells'
  | 'resistance bands'
  | 'pullup bar'
  | 'jump rope';

export interface WorkoutRequest {
  context?: string;
  workoutType: WorkoutType;
  equipment: Equipment[];
}

export interface Exercise {
  id: string;
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
  completed: boolean;
}

export interface Workout {
  id: string;
  date: string; // ISO string
  workoutType: WorkoutType;
  equipment: Equipment[];
  context?: string;
  exercises: Exercise[];
  completedAt?: string; // ISO string when all exercises are done
}

export interface WorkoutHistory {
  workouts: Workout[];
}

