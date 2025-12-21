import { useState } from 'react';

interface PasswordScreenProps {
  onAuthenticated: () => void;
}

export default function PasswordScreen({ onAuthenticated }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctPassword = import.meta.env.VITE_SITE_PASSWORD;
    
    if (password === correctPassword) {
      // Store authentication in localStorage
      localStorage.setItem('repit_authenticated', 'true');
      onAuthenticated();
    } else {
      setError(true);
      setIsShaking(true);
      setPassword('');
      
      // Remove shake animation after it completes
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RepIt</h1>
          <p className="text-gray-600">Enter password to continue</p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
              className={`w-full px-4 py-4 border-2 rounded-lg text-center text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                error
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isShaking ? 'animate-shake' : ''}`}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Unlock
          </button>
        </form>

        {/* Decorative Element */}
        <div className="mt-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
      </div>

      {/* Custom shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}

