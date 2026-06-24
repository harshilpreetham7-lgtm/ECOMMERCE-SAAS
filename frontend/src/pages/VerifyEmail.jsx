import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../services/index.js';

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authService.verifyEmail(token);
        const payload = response && response.data ? response.data : response;
        setMessage(payload.message || 'Email verified successfully');
      } catch (err) {
        setError(err.response?.message || err.message || 'Verification failed');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Email Verification</h2>

        {message && <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
