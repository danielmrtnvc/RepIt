import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { UserGoals, UserProgress } from '../types';

interface StrengthRadarProps {
  goals: UserGoals;
  progress: UserProgress;
  onUpdateGoals: (goals: UserGoals) => void;
  onUpdateProgress: (progress: UserProgress) => void;
}

export default function StrengthRadar({ goals, progress, onUpdateGoals, onUpdateProgress }: StrengthRadarProps) {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);
  const [tempProgress, setTempProgress] = useState(progress);

  // Prepare data for radar chart
  const chartData = [
    {
      exercise: 'Bench Press',
      current: progress.benchPress,
      goal: goals.benchPress,
      percentage: goals.benchPress > 0 ? (progress.benchPress / goals.benchPress) * 100 : 0,
    },
    {
      exercise: 'Military Press',
      current: progress.militaryPress,
      goal: goals.militaryPress,
      percentage: goals.militaryPress > 0 ? (progress.militaryPress / goals.militaryPress) * 100 : 0,
    },
    {
      exercise: 'Deadlift',
      current: progress.deadlift,
      goal: goals.deadlift,
      percentage: goals.deadlift > 0 ? (progress.deadlift / goals.deadlift) * 100 : 0,
    },
    {
      exercise: 'Bicep Curl',
      current: progress.bicepCurl,
      goal: goals.bicepCurl,
      percentage: goals.bicepCurl > 0 ? (progress.bicepCurl / goals.bicepCurl) * 100 : 0,
    },
    {
      exercise: 'Squat',
      current: progress.squat,
      goal: goals.squat,
      percentage: goals.squat > 0 ? (progress.squat / goals.squat) * 100 : 0,
    },
    {
      exercise: 'Plank',
      current: progress.plank,
      goal: goals.plank,
      percentage: goals.plank > 0 ? (progress.plank / goals.plank) * 100 : 0,
    },
  ];

  const handleSaveGoals = () => {
    onUpdateGoals(tempGoals);
    setIsEditingGoals(false);
  };

  const handleSaveProgress = () => {
    onUpdateProgress(tempProgress);
    setIsEditingProgress(false);
  };

  const handleCancelGoals = () => {
    setTempGoals(goals);
    setIsEditingGoals(false);
  };

  const handleCancelProgress = () => {
    setTempProgress(progress);
    setIsEditingProgress(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Strength Tracker</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditingProgress(true)}
            className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Edit Progress
          </button>
          <button
            onClick={() => setIsEditingGoals(true)}
            className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
          >
            Edit Goals
          </button>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="exercise" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
            />
            <Radar
              name="Current"
              dataKey="percentage"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {chartData.map((item) => (
          <div key={item.exercise} className="bg-gray-50 p-2 rounded">
            <p className="font-semibold text-gray-700 text-xs mb-1">{item.exercise}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-blue-600 font-bold">
                {item.current}{item.exercise === 'Plank' ? 's' : 'lb'}
              </span>
              <span className="text-gray-500 text-xs">
                / {item.goal}{item.exercise === 'Plank' ? 's' : 'lb'}
              </span>
            </div>
            <div className="mt-1 bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all"
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Edit Progress Modal */}
      {isEditingProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Edit Current Progress</h3>
            <div className="space-y-3">
              <InputField
                label="Bench Press (lbs)"
                value={tempProgress.benchPress}
                onChange={(v) => setTempProgress({ ...tempProgress, benchPress: v })}
              />
              <InputField
                label="Military Press (lbs)"
                value={tempProgress.militaryPress}
                onChange={(v) => setTempProgress({ ...tempProgress, militaryPress: v })}
              />
              <InputField
                label="Deadlift (lbs)"
                value={tempProgress.deadlift}
                onChange={(v) => setTempProgress({ ...tempProgress, deadlift: v })}
              />
              <InputField
                label="Bicep Curl (lbs)"
                value={tempProgress.bicepCurl}
                onChange={(v) => setTempProgress({ ...tempProgress, bicepCurl: v })}
              />
              <InputField
                label="Squat (lbs)"
                value={tempProgress.squat}
                onChange={(v) => setTempProgress({ ...tempProgress, squat: v })}
              />
              <InputField
                label="Plank (seconds)"
                value={tempProgress.plank}
                onChange={(v) => setTempProgress({ ...tempProgress, plank: v })}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveProgress}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelProgress}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goals Modal */}
      {isEditingGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Edit Goals</h3>
            <div className="space-y-3">
              <InputField
                label="Bench Press Goal (lbs)"
                value={tempGoals.benchPress}
                onChange={(v) => setTempGoals({ ...tempGoals, benchPress: v })}
              />
              <InputField
                label="Military Press Goal (lbs)"
                value={tempGoals.militaryPress}
                onChange={(v) => setTempGoals({ ...tempGoals, militaryPress: v })}
              />
              <InputField
                label="Deadlift Goal (lbs)"
                value={tempGoals.deadlift}
                onChange={(v) => setTempGoals({ ...tempGoals, deadlift: v })}
              />
              <InputField
                label="Bicep Curl Goal (lbs)"
                value={tempGoals.bicepCurl}
                onChange={(v) => setTempGoals({ ...tempGoals, bicepCurl: v })}
              />
              <InputField
                label="Squat Goal (lbs)"
                value={tempGoals.squat}
                onChange={(v) => setTempGoals({ ...tempGoals, squat: v })}
              />
              <InputField
                label="Plank Goal (seconds)"
                value={tempGoals.plank}
                onChange={(v) => setTempGoals({ ...tempGoals, plank: v })}
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveGoals}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelGoals}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function InputField({ label, value, onChange }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        min="0"
        step="1"
      />
    </div>
  );
}
