import { Workout, WorkoutType } from '../types';

interface StatsCardsProps {
  workouts: Workout[];
}

export default function StatsCards({ workouts }: StatsCardsProps) {
  // Calculate total completed workouts
  const totalWorkouts = workouts.filter(w => w.completedAt).length;

  // Calculate workout streak (consecutive days)
  const calculateStreak = () => {
    const completedWorkouts = workouts
      .filter(w => w.completedAt)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (completedWorkouts.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the most recent workout was today or yesterday
    const mostRecentDate = new Date(completedWorkouts[0].date);
    mostRecentDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // If the most recent workout was more than 1 day ago, streak is broken
    if (daysDiff > 1) return 0;

    // Count consecutive days
    for (let i = 1; i < completedWorkouts.length; i++) {
      const currentDate = new Date(completedWorkouts[i - 1].date);
      currentDate.setHours(0, 0, 0, 0);
      
      const previousDate = new Date(completedWorkouts[i].date);
      previousDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Calculate workout type breakdown
  const typeBreakdown = workouts
    .filter(w => w.completedAt)
    .reduce((acc, workout) => {
      acc[workout.workoutType] = (acc[workout.workoutType] || 0) + 1;
      return acc;
    }, {} as Record<WorkoutType, number>);

  const sortedTypes = Object.entries(typeBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Show top 5

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Workouts */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalWorkouts}</p>
              <p className="text-sm text-gray-600">Total Workouts</p>
            </div>
          </div>
        </div>

        {/* Workout Streak */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{streak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Type Breakdown */}
      {sortedTypes.length > 0 && (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Workout Types
          </h3>
          <div className="space-y-2">
            {sortedTypes.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">{type}</span>
                <div className="flex items-center gap-2 flex-1 ml-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(count / totalWorkouts) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
