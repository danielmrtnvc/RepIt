import { useState, useEffect } from 'react';
import { Exercise, Workout } from '../types';

interface WorkoutChecklistProps {
  workout: Workout;
  onExerciseToggle: (exerciseId: string) => void;
  onFinish: () => void;
  onStart: () => void;
  onDelete: () => void;
}

export default function WorkoutChecklist({
  workout,
  onExerciseToggle,
  onFinish,
  onStart,
  onDelete,
}: WorkoutChecklistProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const completedCount = workout.exercises.filter((e) => e.completed).length;
  const totalCount = workout.exercises.length;
  const allCompleted = completedCount === totalCount;
  const hasStarted = workout.startedAt !== undefined;

  // Timer effect
  useEffect(() => {
    if (!hasStarted || workout.completedAt) return;

    const startTime = new Date(workout.startedAt!).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, workout.startedAt, workout.completedAt]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Quote Display */}
      {workout.quote && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-800 italic text-center font-medium">"{workout.quote}"</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {workout.workoutType.charAt(0).toUpperCase() + workout.workoutType.slice(1)} Workout
        </h2>
        {workout.context && (
          <p className="text-sm text-gray-600 mb-2">{workout.context}</p>
        )}
        
        {/* Timer Display */}
        {hasStarted && (
          <div className="mb-3 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-2xl font-bold text-gray-900">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {completedCount} / {totalCount} exercises completed
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round((completedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Start Button or Exercise List */}
      {!hasStarted ? (
        <>
          <button
            onClick={onStart}
            className="w-full py-6 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Workout
          </button>
          
          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border-2 border-red-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Workout
          </button>
        </>
      ) : (
        <>
          {/* Exercise List */}
          <div className="space-y-3">
            {workout.exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onToggle={() => onExerciseToggle(exercise.id)}
              />
            ))}
          </div>

          {/* Finish Button */}
          <button
            onClick={onFinish}
            disabled={!allCompleted}
            className={`w-full py-4 rounded-lg font-semibold transition-colors ${
              allCompleted
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {allCompleted ? 'Finish Workout' : 'Complete All Exercises First'}
          </button>

          {/* Delete Button (for workouts in progress) */}
          {!workout.completedAt && (
            <button
              onClick={onDelete}
              className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border-2 border-red-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Workout
            </button>
          )}
        </>
      )}
    </div>
  );
}

interface ExerciseItemProps {
  exercise: Exercise;
  onToggle: () => void;
}

function ExerciseItem({ exercise, onToggle }: ExerciseItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
        exercise.completed
          ? 'border-green-500 bg-green-50'
          : 'border-gray-300 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div
          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ${
            exercise.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-400 bg-white'
          }`}
        >
          {exercise.completed && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>

        {/* Exercise Details */}
        <div className="flex-1">
          <h3
            className={`font-semibold ${
              exercise.completed ? 'text-green-900 line-through' : 'text-gray-900'
            }`}
          >
            {exercise.name}
          </h3>
          
          {/* Sets & Reps or Duration */}
          {(exercise.sets || exercise.reps || exercise.duration) && (
            <p className="text-sm text-gray-600 mt-1">
              {exercise.sets && exercise.reps && `${exercise.sets} sets × ${exercise.reps} reps`}
              {exercise.duration && exercise.duration}
            </p>
          )}
          
          {/* Notes */}
          {exercise.notes && (
            <p className="text-xs text-gray-500 mt-1">{exercise.notes}</p>
          )}
        </div>
      </div>
    </button>
  );
}

