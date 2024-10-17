import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; 

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser(); 

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null); 
        navigate('/'); 
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow rounded-lg mb-6">
      <div className="container mx-auto flex justify-between items-center p-4">
        <span className="text-3xl font-bold text-yellow-400">
          SoloSync
        </span>
        <div className="flex space-x-4">
          {location.pathname !== '/feed' && (
            <Link
              className="text-gray-700 hover:text-blue-600 transition-colors"
              to="/feed"
            >
              Feed
            </Link>
          )}

          {location.pathname !== '/profile' && (
            <Link
              className="text-gray-700 hover:text-blue-600 transition-colors"
              to="/profile"
            >
              Profile
            </Link>
          )}

          {location.pathname !== `/api/users/${user?.id}/itineraries` && user && (
            <Link
              className="text-gray-700 hover:text-blue-600 transition-colors"
              to={`/api/users/${user.id}/itineraries`}
            >
              My Trips
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
