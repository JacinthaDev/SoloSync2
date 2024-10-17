import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

function AuthForm() {
  const { setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const url = isLogin ? '/login' : '/signup';

    const payload = isLogin
      ? { user: { email: formData.email, password: formData.password } }
      : {
          user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            date_of_birth: formData.date_of_birth,
            email: formData.email,
            password: formData.password,
          },
        };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then((data) => {
        setMessage('You have successfully logged in!');

        const user = {
          user_id: data.user_id,
          first_name: data.first_name, 
          last_name: data.last_name,    
          date_of_birth: data.date_of_birth, 
          email: data.email,             
        };

        setUser(data.user); 
        if (data.user_id) {
          navigate(`/api/users/${data.user_id}/itineraries`);
        } else {
          console.error('User ID not found in response:', data);
          setMessage('Login failed: User ID not found.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Login failed. Please try again.');
      });
  };

  return (
    <div>
      <div className="bg-blue-500 text-white text-4xl font-semibold py-2 w-full text-center">
        Welcome to SoloSync
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          {message && (
            <div className="mb-4 text-green-500">
              {message}
            </div>
          )}
          <div className="flex justify-between mb-4">
            <button onClick={() => setIsLogin(true)} className={`py-2 px-4 rounded ${isLogin ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500 border border-blue-500'}`}>Login</button>
            <button onClick={() => setIsLogin(false)} className={`py-2 px-4 rounded ${!isLogin ? 'bg-blue-500 text-white' : 'bg-transparent text-blue-500 border border-blue-500'}`}>Sign Up</button>
          </div>
          <form onSubmit={handleSubmit}>
            <h2 className="text-center text-lg font-semibold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label htmlFor="first_name" className="block text-gray-700">First Name:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="last_name" className="block text-gray-700">Last Name:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="date_of_birth" className="block text-gray-700">Date of Birth:</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
