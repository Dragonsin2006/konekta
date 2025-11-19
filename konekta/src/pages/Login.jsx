import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const Login = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Konekta | Log-In';
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formValues.email || !formValues.password) {
      return setError('Please fill in both email and password.');
    }
    if (!isValidEmail(formValues.email)) {
      return setError('Please enter a valid email address.');
    }
    if (!formValues.password) {
      return setError('Please enter your password.');
    }

    try {
      setLoading(true);
      const response = await api.login({
        username: formValues.email,
        password: formValues.password,
      });

      if (!response?.username) {
        throw new Error('Login failed. Check your credentials.');
      }

      localStorage.setItem('user', response.username);
      navigate('/feed');
    } catch (err) {
      setError(err.message || 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <main className="w-full max-w-md bg-black/70 border border-[#1f1f1f] rounded-3xl p-8 shadow-[0_0_25px_#A200FF55] backdrop-blur">
        <h1 className="text-center text-4xl font-poppins font-bold mb-8 bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] bg-clip-text text-transparent">
          Log-In
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-pink-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formValues.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] focus:outline-none text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-pink-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={formValues.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] focus:outline-none text-white"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log-In'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 text-gray-500">
          <span className="flex-1 border-t border-[#1f1f1f]" />
          OR
          <span className="flex-1 border-t border-[#1f1f1f]" />
        </div>

        <div
          id="g_id_onload"
          data-client_id="1050991664471-o53bq2g0vqjrfeui9jigrv87tobck04g.apps.googleusercontent.com"
          data-login_uri="http://localhost:3000"
          data-auto_prompt="false"
          data-itp_support="true"
        />
        <div
          className="g_id_signin"
          data-type="standard"
          data-theme="filled_black"
          data-size="large"
          data-shape="rectangular"
          data-logo_alignment="left"
          style={{ width: '100%' }}
        />

        <p className="text-sm text-gray-400 text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[#FF007A] font-semibold">
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Login;

