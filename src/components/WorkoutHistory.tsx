import { Workout } from '../types';

interface WorkoutHistoryProps {
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
  onNewWorkout: () => void;
}

export default function WorkoutHistory({
  workouts,
  onSelectWorkout,
  onNewWorkout,
}: WorkoutHistoryProps) {
  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Workout History</h1>
        <button
          onClick={onNewWorkout}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          New Workout
        </button>
      </div>

      {/* Empty State */}
      {sortedWorkouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No workouts yet!</p>
          <button
            onClick={onNewWorkout}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Generate Your First Workout
          </button>
        </div>
      )}

      {/* Workout List */}
      <div className="space-y-3">
        {sortedWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onClick={() => onSelectWorkout(workout)}
          />
        ))}
      </div>
    </div>
  );
}

interface WorkoutCardProps {
  workout: Workout;
  onClick: () => void;
}

function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  const date = new Date(workout.date);
  const isSportsWorkout = workout.workoutType === 'sports';
  const completedCount = workout.exercises.filter((e) => e.completed).length;
  const totalCount = workout.exercises.length;
  const completionPercentage = isSportsWorkout ? 100 : Math.round((completedCount / totalCount) * 100);
  const isFullyCompleted = workout.completedAt !== undefined;

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
    >
      {/* Date & Type */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">
          {workout.workoutType.charAt(0).toUpperCase() + workout.workoutType.slice(1)}
        </h3>
        <span className="text-xs text-gray-500">
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Equipment or Sports Description Preview */}
      {isSportsWorkout && workout.sportsDescription ? (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {workout.sportsDescription}
        </p>
      ) : (
        workout.equipment.length > 0 && (
          <p className="text-xs text-gray-600 mb-2">
            {workout.equipment.join(', ')}
          </p>
        )
      )}

      {/* Progress Bar */}
      {!isSportsWorkout && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              {completedCount} / {totalCount} exercises
            </span>
            <span
              className={`font-medium ${
                isFullyCompleted ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isFullyCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Completed Badge and Duration */}
      <div className="mt-2 flex items-center justify-between">
        {isFullyCompleted && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Completed
          </div>
        )}
        {workout.duration !== undefined && workout.duration > 0 && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(workout.duration)}
          </div>
        )}
      </div>
    </button>
  );
}

