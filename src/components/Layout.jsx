import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { refreshSession, logout } from '../store/authSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    // Defeat the 15-minute token expiration trap
    if (token) {
      const interval = setInterval(() => {
        dispatch(refreshSession());
      }, 14 * 60 * 1000); // Fire every 14 minutes
      return () => clearInterval(interval);
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between">
        <div className="font-bold text-xl">Ivy Homes Intern App</div>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Browse</Link>
          <Link to="/saved" className="hover:underline">Saved</Link>
          <Link to="/insights" className="hover:underline">Insights</Link>
          <button onClick={() => dispatch(logout())} className="text-red-200 hover:text-white">
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-grow p-4 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-gray-400 text-center py-6 mt-auto">
        <p>Data certified by 100acres · 100A-4CB438</p>
      </footer>
    </div>
  );
};

export default Layout;