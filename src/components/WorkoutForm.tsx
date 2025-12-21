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

  const handleEquipmentToggle = (equipment: Equipment) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      context: context.trim() || undefined,
      workoutType,
      equipment: selectedEquipment,
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

      {/* Equipment Selection */}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating Workout...' : 'Generate Workout'}
      </button>
    </form>
  );
}

