import { Exercise, Workout } from '../types';

interface WorkoutChecklistProps {
  workout: Workout;
  onExerciseToggle: (exerciseId: string) => void;
  onFinish: () => void;
}

export default function WorkoutChecklist({
  workout,
  onExerciseToggle,
  onFinish,
}: WorkoutChecklistProps) {
  const completedCount = workout.exercises.filter((e) => e.completed).length;
  const totalCount = workout.exercises.length;
  const allCompleted = completedCount === totalCount;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {workout.workoutType.charAt(0).toUpperCase() + workout.workoutType.slice(1)} Workout
        </h2>
        {workout.context && (
          <p className="text-sm text-gray-600 mb-2">{workout.context}</p>
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
        className={`w-full py-4 rounded-lg font-semibold transition-colors ${
          allCompleted
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-300 text-gray-600'
        }`}
      >
        {allCompleted ? 'Finish Workout' : 'Complete All Exercises First'}
      </button>
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

