import { useState, useEffect } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutChecklist from './components/WorkoutChecklist';
import WorkoutHistory from './components/WorkoutHistory';
import PasswordScreen from './components/PasswordScreen';
import StatsCards from './components/StatsCards';
import StrengthRadar from './components/StrengthRadar';
import { Workout, WorkoutRequest, UserGoals, UserProgress } from './types';
import { generateWorkout } from './utils/openai';
import {
  getWorkoutHistory,
  saveWorkout,
  updateWorkout,
  deleteWorkout,
  getUserGoals,
  saveUserGoals,
  getUserProgress,
  saveUserProgress,
} from './utils/storage';

type View = 'history' | 'form' | 'checklist';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<View>('history');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('repit_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load workout history and user data on mount (after authentication)
  useEffect(() => {
    if (isAuthenticated) {
      const history = getWorkoutHistory();
      setWorkoutHistory(history.workouts);
      
      const goals = getUserGoals();
      setUserGoals(goals);
      
      const progress = getUserProgress();
      setUserProgress(progress);
    }
  }, [isAuthenticated]);

  // Handle workout generation
  const handleGenerateWorkout = async (request: WorkoutRequest) => {
    setLoading(true);
    setError(null);

    try {
      // Handle sports workouts differently - no OpenAI generation
      if (request.workoutType === 'sports') {
        const sportsWorkout: Workout = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          workoutType: request.workoutType,
          equipment: [],
          context: request.context,
          exercises: [], // No exercises for sports workouts
          sportsDescription: request.sportsDescription,
        };

        // Save to localStorage
        saveWorkout(sportsWorkout);

        // Update state
        setCurrentWorkout(sportsWorkout);
        setWorkoutHistory((prev) => [sportsWorkout, ...prev]);

        // Navigate to checklist view
        setView('checklist');
      } else {
        // Generate workout using OpenAI for other workout types
        const { exercises, quote } = await generateWorkout(request);

        const newWorkout: Workout = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          workoutType: request.workoutType,
          equipment: request.equipment,
          context: request.context,
          exercises,
          quote,
        };

        // Save to localStorage
        saveWorkout(newWorkout);

        // Update state
        setCurrentWorkout(newWorkout);
        setWorkoutHistory((prev) => [newWorkout, ...prev]);

        // Navigate to checklist view
        setView('checklist');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate workout. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle exercise toggle in checklist
  const handleExerciseToggle = (exerciseId: string) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map((exercise) =>
      exercise.id === exerciseId
        ? { ...exercise, completed: !exercise.completed }
        : exercise
    );

    const updatedWorkout: Workout = {
      ...currentWorkout,
      exercises: updatedExercises,
    };

    // Update localStorage
    updateWorkout(currentWorkout.id, updatedWorkout);

    // Update state
    setCurrentWorkout(updatedWorkout);
    setWorkoutHistory((prev) =>
      prev.map((w) => (w.id === currentWorkout.id ? updatedWorkout : w))
    );
  };

  // Handle start workout
  const handleStartWorkout = () => {
    if (!currentWorkout) return;

    const startedWorkout: Workout = {
      ...currentWorkout,
      startedAt: new Date().toISOString(),
    };

    // Update localStorage
    updateWorkout(currentWorkout.id, startedWorkout);

    // Update state
    setCurrentWorkout(startedWorkout);
    setWorkoutHistory((prev) =>
      prev.map((w) => (w.id === currentWorkout.id ? startedWorkout : w))
    );
  };

  // Handle finish workout
  const handleFinishWorkout = () => {
    if (!currentWorkout) return;

    const isSportsWorkout = currentWorkout.workoutType === 'sports';
    const allCompleted = isSportsWorkout || currentWorkout.exercises.every((e) => e.completed);

    if (!allCompleted && !isSportsWorkout) {
      alert('Please complete all exercises before finishing the workout.');
      return;
    }

    const completedAt = new Date().toISOString();
    let duration: number | undefined;

    // Only calculate duration for non-sports workouts with a start time
    if (!isSportsWorkout && currentWorkout.startedAt) {
      const startTime = new Date(currentWorkout.startedAt).getTime();
      const endTime = new Date(completedAt).getTime();
      duration = Math.floor((endTime - startTime) / 1000); // duration in seconds
    }

    const completedWorkout: Workout = {
      ...currentWorkout,
      completedAt,
      duration,
    };

    // Update localStorage
    updateWorkout(currentWorkout.id, completedWorkout);

    // Update state
    setWorkoutHistory((prev) =>
      prev.map((w) => (w.id === currentWorkout.id ? completedWorkout : w))
    );

    // Navigate back to history
    setCurrentWorkout(null);
    setView('history');
  };

  // Handle selecting a workout from history
  const handleSelectWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setView('checklist');
  };

  // Handle starting a new workout
  const handleNewWorkout = () => {
    setCurrentWorkout(null);
    setError(null);
    setView('form');
  };

  // Handle going back
  const handleBack = () => {
    if (view === 'form' || view === 'checklist') {
      setView('history');
      setCurrentWorkout(null);
      setError(null);
    }
  };

  // Handle updating user goals
  const handleUpdateGoals = (goals: UserGoals) => {
    saveUserGoals(goals);
    setUserGoals(goals);
  };

  // Handle updating user progress
  const handleUpdateProgress = (progress: UserProgress) => {
    saveUserProgress(progress);
    setUserProgress(progress);
  };

  // Handle delete workout with confirmation
  const handleDeleteWorkout = () => {
    if (!currentWorkout) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this workout? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      // Delete from localStorage
      deleteWorkout(currentWorkout.id);

      // Update state
      setWorkoutHistory((prev) => prev.filter((w) => w.id !== currentWorkout.id));

      // Navigate back to history
      setCurrentWorkout(null);
      setView('history');
    } catch (error) {
      setError('Failed to delete workout. Please try again.');
    }
  };

  // Show password screen if not authenticated
  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          {view !== 'history' ? (
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}
          <h1 className="text-xl font-bold text-gray-900">RepIt</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Routing */}
        {view === 'history' && (
          <>
            {/* Stats Cards */}
            {workoutHistory.length > 0 && (
              <div className="mb-6">
                <StatsCards workouts={workoutHistory} />
              </div>
            )}

            {/* Strength Radar Chart */}
            {userGoals && userProgress && (
              <div className="mb-6">
                <StrengthRadar
                  goals={userGoals}
                  progress={userProgress}
                  onUpdateGoals={handleUpdateGoals}
                  onUpdateProgress={handleUpdateProgress}
                />
              </div>
            )}

            {/* Workout History */}
            <WorkoutHistory
              workouts={workoutHistory}
              onSelectWorkout={handleSelectWorkout}
              onNewWorkout={handleNewWorkout}
            />
          </>
        )}

        {view === 'form' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Generate Workout
            </h2>
            <WorkoutForm onSubmit={handleGenerateWorkout} loading={loading} />
          </div>
        )}

        {view === 'checklist' && currentWorkout && (
          <WorkoutChecklist
            workout={currentWorkout}
            onExerciseToggle={handleExerciseToggle}
            onFinish={handleFinishWorkout}
            onStart={handleStartWorkout}
            onDelete={handleDeleteWorkout}
          />
        )}
      </main>
    </div>
  );
}

