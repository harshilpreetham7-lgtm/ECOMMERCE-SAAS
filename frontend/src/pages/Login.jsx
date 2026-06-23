import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading, setError } from '../store/slices/authSlice.js';
import { authService } from '../services/index.js';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const response = await authService.login(formData);
      // Normalize response shape (some APIs wrap in `data`)
      const payload = response && response.data ? response.data : response;
      const user = payload.user || payload?.data?.user;
      const token = payload.token || payload?.data?.token;

      if (!user || !token) {
        throw new Error('Invalid login response from server');
      }

      dispatch(loginSuccess({ user, token }));
      // Ensure redirect happens; use navigate but fallback to full reload if PrivateRoute blocks unexpectedly
      const target = user.role === 'vendor' ? '/vendor/dashboard' : '/';
      try {
        navigate(target);
      } catch (navErr) {
        // Fallback: force browser navigation
        window.location.href = target;
      }
    } catch (err) {
      const message = err.message || 'Login failed';
      setErrorMsg(message);
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {error && <div className="bg-red-100 border border-red-400 text-danger px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
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

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition font-medium"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-primary hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
