import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';


const ItineraryShow = () => {
  const { user_id, itinerary_id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const fromProfile = location.state
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);


  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`/api/users/${user_id}/itineraries/${itinerary_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItinerary(data);

        const commentsResponse = await fetch(`/api/users/${user_id}/itineraries/${itinerary_id}/comments`);
        if (!commentsResponse.ok) {
          throw new Error('Network response was not ok for comments');
        }
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching itinerary or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [user_id, itinerary_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">No itinerary found.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/users/${user_id}/itineraries/${itinerary_id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        user_id: user_id,
        itinerary_id: itinerary_id
      }),
    });

    if (response.ok) {
      setContent('');
    } else {
      console.error('Failed to post comment');
    }
  };

  const handleEdit = (comment_id) => {
    navigate(`/api/users/${user_id}/itineraries/${itinerary_id}/comments/${comment_id}/edit`);
  };

  const handleDelete = async (comment_id) => {
    const response = await fetch(`/api/users/${user_id}/itineraries/${itinerary_id}/comments/${comment_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setComments(comments.filter(comment => comment.id !== comment_id));
    } else {
      console.error('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy h:mm a');
  };

  const formatDateWithoutTime = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  return (
    <div className="flex flex-col items-center mt-8">
      <div className="relative grid overflow-hidden rounded-lg shadow-md bg-yellow-100 w-full max-w-md min-h-[20rem]">
        <div className="absolute inset-0 opacity-50 mx-auto" />
        <div className="relative p-6 z-10 flex flex-col justify-start">
          <p className="text-1xl font-bold text-center mb-4">{itinerary.user.first_name} {itinerary.user.last_name}'s Trip</p>
          <div className="flex justify-center mb-2">
            <div className="border border-gray-300 bg-white rounded-full px-8 py-3 shadow-md">
              <h2 className="text-2xl font-bold text-black text-center">
                {itinerary.city}, {itinerary.country}
              </h2>
              <p className="text-lg text-black text-center">
                {formatDateWithoutTime(itinerary.start_date)} - {formatDateWithoutTime(itinerary.end_date)}
              </p>
            </div>
          </div>
          <p className="text-lg text-black text-center mb-4">{itinerary.description}</p>
          
          <div className="mt-4">
            {comments.length > 0 ? (
              <div className="max-h-60 overflow-y-scroll border-4 border-blue-300 p-4">
                {comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-300 py-2">
                    <p className="text-md font-semibold">{comment.user.first_name} {comment.user.last_name}</p>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                    <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
                    {user && user.id === comment.user_id && (
                      <div className="flex space-x-2 mt-2">
                        <button 
                          className="text-blue-500 hover:underline"
                          onClick={() => handleEdit(comment.id)}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-md text-gray-500 text-center">No comments yet.</p>
            )}
          </div>


          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Leave a comment"
              required
              className="w-full h-20 border border-gray-300 rounded-lg p-2 mb-2" 
            />
            <button
              type="submit"
              className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition w-full"
              onClick={() => window.location.reload()}
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        {!fromProfile && (
          <button
            onClick={() => window.location.href = '/feed'}
            className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition"
          >
            Back to Itineraries
          </button>
        )}
        {fromProfile && (
          <button
            onClick={() => window.history.back()}
            className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition"
          >
            Go Back to {itinerary.user.first_name}'s Profile
          </button>
        )}
      </div>
    </div>
  );
};  

export default ItineraryShow;
