import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const initialState = {
  fullName: '',
  username: '',
  email: '',
  dob: '',
  age: '',
  gender: '',
  password: '',
  confirmPassword: '',
};

const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);
const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[a-z]/.test(password) &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);

const calculateAge = (dob) => {
  if (!dob) return '';
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Konekta | Sign Up';
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => {
      if (name === 'dob') {
        const ageFromDob = calculateAge(value);
        return { ...prev, dob: value, age: ageFromDob || '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const { fullName, username, email, dob, age, gender, password, confirmPassword } = values;

    if (!fullName || !username || !email || !dob || !age || !gender || !password || !confirmPassword) {
      return setError('Please fill in all fields.');
    }
    if (fullName.trim().length < 2) {
      return setError('Please enter your full name.');
    }
    if (!isValidUsername(username)) {
      return setError('Username must be 3-20 characters (letters, numbers, underscores only).');
    }
    if (!isValidEmail(email)) {
      return setError('Please enter a valid email address.');
    }
    if (Number(age) < 13) {
      return setError('You must be at least 13 years old to sign up.');
    }
    if (!isStrongPassword(password)) {
      return setError('Password must be 8+ chars with uppercase, lowercase, number, and special character.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      setLoading(true);
      const response = await api.register({
        username,
        email,
        password,
        fullName,
        dob,
        age: Number(age),
        gender,
      });

      if (!response?.username) {
        throw new Error(response?.message || 'Registration failed. Try a different username/email.');
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
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-10 overflow-y-auto">
      <main className="w-full max-w-2xl bg-black/80 border border-[#2a2a2a] rounded-3xl p-8 shadow-[0_0_45px_#A200FF55] backdrop-blur">
        <h1 className="text-center text-4xl font-poppins font-bold bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] bg-clip-text text-transparent">
          Create Account
        </h1>

        <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-sm font-semibold text-pink-300">Full Name</span>
              <input
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="mt-1 w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] text-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-pink-300">Username</span>
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="johndoe123"
                required
                className="mt-1 w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] text-white"
              />
              <span className="text-xs text-gray-500">3-20 characters, letters/numbers/underscores only</span>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-pink-300">Email</span>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="yourname@gmail.com"
              required
              className="mt-1 w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] text-white"
            />
          </label>

          <div className="grid md:grid-cols-3 gap-5">
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-pink-300">Date of Birth</span>
              <input
                type="date"
                name="dob"
                value={values.dob}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] text-white"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-pink-300">Age</span>
              <input
                type="number"
                name="age"
                value={values.age}
                onChange={handleChange}
                min="13"
                max="120"
                placeholder="18"
                required
                className="mt-1 w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] text-white"
              />
            </label>
          </div>

          <div>
            <span className="text-sm font-semibold text-pink-300">Gender</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {['male', 'female', 'other'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={values.gender === option}
                    onChange={handleChange}
                    required
                    className="text-[#FF007A] focus:ring-[#FF007A]"
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-sm font-semibold text-pink-300">Password</span>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="mt-1 w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] text-white"
              />
              <span className="text-xs text-gray-500">8+ chars, uppercase, lowercase, number & special character</span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-pink-300">Confirm Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="mt-1 w-full px-4 py-3 rounded-full bg-[#1a1a1a] border border-transparent focus:border-[#FF007A] text-white"
              />
            </label>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-[#FF007A] via-[#A200FF] to-[#00F5FF] hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6 text-gray-500">
          <span className="flex-1 border-t border-[#1f1f1f]" />
          OR
          <span className="flex-1 border-t border-[#1f1f1f]" />
        </div>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF007A] font-semibold">
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Signup;

