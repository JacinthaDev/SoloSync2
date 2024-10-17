import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';

const Profile = () => {
  const { user, setUser } = useUser();
  const [bio, setBio] = useState('No bio yet');
  const [profilePicture, setProfilePicture] = useState('/default.png');
  const [age, setAge] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        const response = await fetch(`/api/users/${user.id}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setBio(userData.bio || 'No bio yet');
          setProfilePicture(userData.profile_picture || '/default.png');
          if (userData.date_of_birth) {
            calculateAge(userData.date_of_birth);
          }
        }
      }
    };

    fetchUserData();
  }, [user?.id, setUser]);

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

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="relative grid overflow-hidden rounded-lg shadow-md bg-white w-full max-w-md p-6">
        <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2">{user?.first_name} {user?.last_name}</h1>
        <p className="text-lg text-center mb-4">Age: {age}</p>
        
        <label className="text-lg font-semibold mb-2">Your Bio:</label>
        <p className="text-lg text-center mb-4">{bio}</p>
        
        <button
          onClick={() => window.location.href = '/edit-profile'} 
          className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition w-full"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
