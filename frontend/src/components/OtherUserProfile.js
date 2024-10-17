import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OtherUserProfile = () => {
  const { user_id } = useParams(); 
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('No bio yet');
  const [profilePicture, setProfilePicture] = useState('/default.png');
  const [age, setAge] = useState(0);
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/users/${user_id}/user-profile`);
      if (response.ok) {
        const data = await response.json();
        const { user, itineraries } = data;
        
        setUser(user);
        setBio(user.bio || 'No bio yet');
        setProfilePicture(user.profile_picture || '/default.png');
        setItineraries(itineraries);

        if (user.date_of_birth) {
          calculateAge(user.date_of_birth);
        }
      }
    };

    fetchUserData();
  }, [user_id]);

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setAge(age);
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
      <div className="relative grid overflow-hidden rounded-lg shadow-md bg-white w-full max-w-md p-6">
        <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2">{user?.first_name} {user?.last_name}</h1>
        <p className="text-lg text-center mb-4">Age: {age}</p>
        
        <label className="text-lg font-semibold mb-2">Bio:</label>
        <p className="text-lg text-center mb-4">{bio}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mt-10">
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <div key={itinerary.id} className="relative grid min-h-[20rem] overflow-hidden rounded-lg shadow-md bg-white">
              <div className="absolute inset-0 bg-yellow-200 opacity-50 mx-auto" />
              <div className="relative p-6 z-10 flex flex-col justify-between h-full">
                <div className="mt-4 border border-gray-300 bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-xl font-semibold text-black text-center">{itinerary.city}, {itinerary.country}</h3>
                  <p className="text-black mb-1 text-center">
                    {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                  </p>
                </div>
                <div className="mt-8 border border-gray-300 bg-white rounded-lg shadow-md p-4">
                  <div className="text-black mb-4 text-center">
                    <p className="mt-1">{itinerary.description}</p>
                    <div className="flex justify-center mt-4">
                      <Link
                        to={{
                          pathname: `/api/users/${itinerary.user_id}/itineraries/${itinerary.id}/show`, 
                          state: { fromProfile: true }
                        }}
                        className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition text-center"
                      >
                        See this itinerary
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No itineraries found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default OtherUserProfile;
