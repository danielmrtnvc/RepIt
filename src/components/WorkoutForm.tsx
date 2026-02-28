import { useState } from 'react';
import { WorkoutType, Equipment, WorkoutRequest } from '../types';

const WORKOUT_TYPES: WorkoutType[] = [
  'push',
  'pull',
  'legs',
  'cardio',
  'HIIT',
  'arms',
  'full body',
  'stretching',
  'sports',
];

const EQUIPMENT_OPTIONS: Equipment[] = [
  'bodyweight',
  'barbell',
  'dumbbells',
  'resistance bands',
  'pullup bar',
  'jump rope',
];

interface WorkoutFormProps {
  onSubmit: (request: WorkoutRequest) => void;
  loading: boolean;
}

export default function WorkoutForm({ onSubmit, loading }: WorkoutFormProps) {
  const [context, setContext] = useState('');
  const [workoutType, setWorkoutType] = useState<WorkoutType>('push');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [sportsDescription, setSportsDescription] = useState('');

  const isSportsWorkout = workoutType === 'sports';

  const handleEquipmentToggle = (equipment: Equipment) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSportsWorkout && !sportsDescription.trim()) {
      alert('Please enter a description of your sports activity.');
      return;
    }
    
    onSubmit({
      context: context.trim() || undefined,
      workoutType,
      equipment: selectedEquipment,
      sportsDescription: isSportsWorkout ? sportsDescription.trim() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Context Input */}
      <div>
        <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
          Workout Context (Optional)
        </label>
        <input
          type="text"
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., short workout, knee friendly, strength focused"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Workout Type */}
      <div>
        <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700 mb-2">
          Workout Type *
        </label>
        <select
          id="workoutType"
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
          required
        >
          {WORKOUT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Sports Description (only for sports workouts) */}
      {isSportsWorkout ? (
        <div>
          <label htmlFor="sportsDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Sports Activity Description *
          </label>
          <textarea
            id="sportsDescription"
            value={sportsDescription}
            onChange={(e) => setSportsDescription(e.target.value)}
            placeholder="Describe your sports activity (e.g., Played basketball for 1 hour, ran 5 miles, tennis match with friends, etc.)"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter details about your sports activity including what you did, duration, and any other relevant information.
          </p>
        </div>
      ) : (
        /* Equipment Selection (for generated workouts) */
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Equipment (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EQUIPMENT_OPTIONS.map((equipment) => (
              <button
                key={equipment}
                type="button"
                onClick={() => handleEquipmentToggle(equipment)}
                disabled={loading}
                className={`px-4 py-3 rounded-lg border-2 transition-colors text-left ${
                  selectedEquipment.includes(equipment)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? (isSportsWorkout ? 'Saving...' : 'Generating Workout...') : (isSportsWorkout ? 'Save Sports Activity' : 'Generate Workout')}
      </button>
    </form>
  );
}

