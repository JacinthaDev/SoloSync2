import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Feed = () => {
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch('/api/itineraries/feed'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      }
    };

    fetchItineraries();
  }, []);

  const handleShow = (user_id, itinerary_id) => {
    navigate(`/api/users/${user_id}/itineraries/${itinerary_id}/show`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="bg-white rounded-full shadow-lg px-6 py-3 mb-8">
        <h1 className="text-3xl font-bold text-center">Syncer Travels</h1>
      </div>
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="relative grid min-h-[20rem] overflow-hidden rounded-lg shadow-md bg-white"
            >
              <div className="absolute inset-0 bg-yellow-200 opacity-50 mx-auto" />
              <div className="relative p-6 z-10 flex flex-col justify-between h-full">
                <div className="flex justify-center">
                  <img
                    src={itinerary.user.profile_picture_url || '/default.png'}
                    alt={`${itinerary.user.first_name} ${itinerary.user.last_name}`}
                    className="w-16 h-16 rounded-full mb-2"
                  />
                </div>
                <div className="mt-4 border border-gray-300 bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-xl font-semibold text-black text-center">
                    {itinerary.city}, {itinerary.country}
                  </h3>
                  <p className="text-black mb-1 text-center">
                    {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                  </p>
                </div>
                <div className="mt-8 border border-gray-300 bg-white rounded-lg shadow-md p-4">
                  <div className="text-black mb-4 text-center">
                    <p className="font-bold">
                      Why{' '}
                      <Link to={`/api/users/${itinerary.user_id}/user-profile`} className="text-blue-400 hover:underline"> 
                        {itinerary.user.first_name} {itinerary.user.last_name}
                      </Link>{' '}
                      is traveling:
                    </p>
                    <p className="mt-1">{itinerary.description}</p>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleShow(itinerary.user_id, itinerary.id)}
                      className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
                    >
                      See this itinerary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No itineraries found.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
