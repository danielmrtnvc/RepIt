import { useState, useEffect } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutChecklist from './components/WorkoutChecklist';
import WorkoutHistory from './components/WorkoutHistory';
import PasswordScreen from './components/PasswordScreen';
import { Workout, WorkoutRequest } from './types';
import { generateWorkout } from './utils/openai';
import {
  getWorkoutHistory,
  saveWorkout,
  updateWorkout,
} from './utils/storage';

type View = 'history' | 'form' | 'checklist';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<View>('history');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('repit_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load workout history on mount (after authentication)
  useEffect(() => {
    if (isAuthenticated) {
      const history = getWorkoutHistory();
      setWorkoutHistory(history.workouts);
    }
  }, [isAuthenticated]);

  // Handle workout generation
  const handleGenerateWorkout = async (request: WorkoutRequest) => {
    setLoading(true);
    setError(null);

    try {
      const exercises = await generateWorkout(request);

      const newWorkout: Workout = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        workoutType: request.workoutType,
        equipment: request.equipment,
        context: request.context,
        exercises,
      };

      // Save to localStorage
      saveWorkout(newWorkout);

      // Update state
      setCurrentWorkout(newWorkout);
      setWorkoutHistory((prev) => [newWorkout, ...prev]);

      // Navigate to checklist view
      setView('checklist');
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

  // Handle finish workout
  const handleFinishWorkout = () => {
    if (!currentWorkout) return;

    const allCompleted = currentWorkout.exercises.every((e) => e.completed);

    if (!allCompleted) {
      alert('Please complete all exercises before finishing the workout.');
      return;
    }

    const completedWorkout: Workout = {
      ...currentWorkout,
      completedAt: new Date().toISOString(),
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
          <WorkoutHistory
            workouts={workoutHistory}
            onSelectWorkout={handleSelectWorkout}
            onNewWorkout={handleNewWorkout}
          />
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
          />
        )}
      </main>
    </div>
  );
}

