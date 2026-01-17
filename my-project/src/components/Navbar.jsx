import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔒 Not logged in → no navbar
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white px-6 py-3 flex justify-between items-center">
      {/* LEFT */}
      <Link to="/" className="font-bold text-lg">
        TaskManager
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        <Link to="/create" className="hover:underline">
          Create Task
        </Link>

        {/* 🔥 ADMIN ONLY */}
        {/*user.role === 'admin' && (
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        )*/}

        {/* 🔥 PROFILE LINK */}
        <Link
          to="/profile"
          className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded"
        >
          <span className="text-sm">{user.name}</span>
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
            {user.role}
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
