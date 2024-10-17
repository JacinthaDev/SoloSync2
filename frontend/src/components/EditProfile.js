import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';

const EditProfile = () => {
  const { user, setUser } = useUser();
  const [bio, setBio] = useState(user?.bio || 'No bio yet');
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '/default.png');

  useEffect(() => {
    setBio(user?.bio || 'No bio yet');
    setProfilePicture(user?.profile_picture || '/default.png');
  }, [user]);

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };
  

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('user[bio]', bio);
    
    if (profilePicture instanceof File) {
      formData.append('user[profile_picture]', profilePicture);
    }
  
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: formData,
    });
  
    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
      window.location.href = '/profile'; 
    }
  };
  

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="relative grid overflow-hidden rounded-lg shadow-md bg-white w-full max-w-md p-6">
      <img
        src={typeof profilePicture === 'string' ? profilePicture : URL.createObjectURL(profilePicture)} 
        alt="Profile" 
        className="w-32 h-32 rounded-full mx-auto mb-4" 
      />

        
        <label className="text-lg font-semibold mb-2">Your Bio:</label>
        <textarea
          value={bio}
          onChange={handleBioChange}
          placeholder="Add your bio..."
          className="w-full h-20 border border-gray-300 rounded-lg p-2 mb-4"
        />
  
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="mb-4"
        />
        <button
          onClick={handleSave}
          className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition w-full"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
