import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../UserContext'; 

const EditItinerary = () => {
  const { user } = useUser();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/itineraries/${id}`);
        if (!response.ok) {
          throw new Error('Could not fetch itinerary');
        }
        const data = await response.json();
        setItinerary(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (user) { 
      fetchItinerary();
    }
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user.user_id}/itineraries/${id}`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary),
      });

      if (!response.ok) {
        throw new Error('Could not update itinerary');
      }

      navigate(`/api/users/${user.user_id}/itineraries`); 
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto p-6 bg-yellow-100 rounded-lg shadow-md max-w-lg mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Itinerary</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">City:</span>
          <input 
            type="text" 
            name="city" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" 
            value={itinerary.city} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Country:</span>
          <input 
            type="text" 
            name="country" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" 
            value={itinerary.country} 
            onChange={handleChange} 
            required 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Start Date:</span>
          <input 
            type="date" 
            name="start_date" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" 
            value={itinerary.start_date} 
            onChange={handleChange} 
            min={today}
            required 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">End Date:</span>
          <input 
            type="date" 
            name="end_date" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" 
            value={itinerary.end_date} 
            onChange={handleChange} 
            min={itinerary.start_date || today}
            required 
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Tell other Syncers why you're traveling:</span>
          <textarea 
            name="description" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" 
            value={itinerary.description} 
            onChange={handleChange} 
            required 
          />
        </label>
        <button 
          type="submit" 
          className="w-full bg-blue-400 text-white font-bold p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Save
        </button>
        <button 
          type="button" 
          className="w-full bg-gray-300 text-black font-bold p-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
          onClick={() => navigate(`/api/users/${user.user_id}/itineraries`)} 
        >
          Go Back
        </button>
      </form>
    </div>
  );  
};

export default EditItinerary;