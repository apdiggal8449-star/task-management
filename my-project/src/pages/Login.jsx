import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false); // 🔥 Loading state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Email and password required');
      return;
    }

    setLoading(true); // 🔥 Start loading
    try {
      const res = await login({ email: form.email, password: form.password });
const user = res.user;
      // Optional: check if selected role matches backend role
     // if (form.role !== user.role) {
       // toast.warning(`You selected ${form.role} but your account is ${user.role}`);
     // }

      // Role-based redirect
      navigate('/'); // Admin or user dashboard same route

      toast.success(`Welcome, ${user.name} (${user.role})`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // 🔥 Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          value={form.password}
          onChange={handleChange}
        />

        {/* Role selector */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border mb-4 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading} // 🔒 disable while loading
          className={`w-full py-2 rounded text-white font-semibold transition ${
            loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Creating...' : 'Login'} {/* 🔥 Loading text */}
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
