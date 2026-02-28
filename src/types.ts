// Core data models for the workout app

export type WorkoutType =
  | 'push'
  | 'pull'
  | 'legs'
  | 'cardio'
  | 'HIIT'
  | 'arms'
  | 'full body'
  | 'stretching'
  | 'sports';

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
  sportsDescription?: string; // For sports workouts
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
  startedAt?: string; // ISO string when user starts the workout
  completedAt?: string; // ISO string when all exercises are done
  duration?: number; // Duration in seconds
  quote?: string; // Motivational quote
  sportsDescription?: string; // For sports workouts - description of activity
}

export interface UserGoals {
  benchPress: number; // in lbs
  militaryPress: number; // in lbs
  deadlift: number; // in lbs
  bicepCurl: number; // in lbs
  squat: number; // in lbs
  plank: number; // in seconds
}

export interface UserProgress {
  benchPress: number; // in lbs
  militaryPress: number; // in lbs
  deadlift: number; // in lbs
  bicepCurl: number; // in lbs
  squat: number; // in lbs
  plank: number; // in seconds
}

export interface WorkoutHistory {
  workouts: Workout[];
}

