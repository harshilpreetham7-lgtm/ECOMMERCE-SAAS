import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/index.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus(null);
    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      const payload = response && response.data ? response.data : response;
      setStatus(payload.message || 'If that email is registered, you will receive reset instructions.');
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>

        {status && <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">{status}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition font-medium">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-4">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
