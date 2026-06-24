import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authService } from '../services/index.js';

export default function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus(null);
    setLoading(true);

    try {
      const response = await authService.resetPassword(token, formData);
      const payload = response && response.data ? response.data : response;
      setStatus(payload.message || 'Password reset successful. You can now login.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.message || err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>

        {status && <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">{status}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition font-medium">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center mt-4">
          Back to{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
