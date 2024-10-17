import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditComment = () => {
  const { user_id, itinerary_id, comment_id } = useParams();
  const [content, setContent] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(`/api/users/${user_id}/itineraries/${itinerary_id}/comments/${comment_id}`);
        
        if (!response.ok) {
          throw new Error('Could not fetch comment');
        }
        
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [user_id, itinerary_id, comment_id]); 

  const handleGoBack = () => {
    navigate(`/api/users/${user_id}/itineraries/${itinerary_id}/show`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/users/${user_id}/itineraries/${itinerary_id}/comments/${comment_id}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content, 
      }),
    });

    if (response.ok) {
      navigate(`/api/users/${user_id}/itineraries/${itinerary_id}/show`);
    } else {
      console.error('Failed to update comment');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <p className="text-md mb-2">Editing Comment:</p> 
      <textarea
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        placeholder="Edit your comment"
        required
        className="w-80 h-16 border border-gray-300 rounded-lg p-2 mb-2" 
      />
      <div className="flex justify-center mt-4 space-x-4">
        <button type="submit" className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition">
          Update Comment
        </button>

        <button onClick={handleGoBack} className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition">  
          Go Back
        </button>
      </div>
    </form>
  );
};

export default EditComment;
