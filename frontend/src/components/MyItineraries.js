import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { format, parseISO } from 'date-fns';

const MyItineraries = () => {
  const { user } = useUser(); 
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/itineraries`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItineraries(data);

        const commentsData = await Promise.all(data.map(async (itinerary) => {
          const commentsResponse = await fetch(`/api/users/${user.id}/itineraries/${itinerary.id}/comments`);
          if (!commentsResponse.ok) {
            throw new Error('Network response was not ok for comments');
          }
          return { id: itinerary.id, comments: await commentsResponse.json() };
        }));

        const commentsMap = {};
        commentsData.forEach(({ id, comments }) => {
          commentsMap[id] = comments;
        });
        setComments(commentsMap);
      } catch (error) {
        console.error('Error fetching itineraries or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [user.id]);

  const handleCommentSubmit = async (id) => {
    const response = await fetch(`/api/users/${user.id}/itineraries/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: commentContent[id],
        user_id: user.id,
        itinerary_id: id,
      }),
    });

    if (response.ok) {
      setCommentContent({ ...commentContent, [id]: '' });
      const commentsResponse = await fetch(`/api/users/${user.id}/itineraries/${id}/comments`);
      const commentsData = await commentsResponse.json();
      setComments((prevComments) => ({ ...prevComments, [id]: commentsData }));
    } else {
      console.error('Failed to post comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/users/${user.id}/itineraries/${id}`, { method: 'DELETE' });
      setItineraries(itineraries.filter(itinerary => itinerary.id !== id));
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/api/users/${user.id}/itineraries/${id}/edit`);
  };

  const handleEditComment = (comment_id, id) => {
    navigate(`/api/users/${user.id}/itineraries/${id}/comments/${comment_id}/edit`);
  };

  const handleDeleteComment = async (comment_id, id) => {
    const response = await fetch(`/api/users/${user.id}/itineraries/${id}/comments/${comment_id}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      setComments((prevComments) => ({
        ...prevComments,
        [id]: prevComments[id].filter(comment => comment.id !== comment_id),
      }));
    } else {
      console.error('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  const formatDateWithTime = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy h:mm a');
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="bg-white rounded-full shadow-lg px-6 py-3 mb-8">
        <h1 className="text-3xl font-bold text-center">My Itineraries</h1>
      </div>
      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {itineraries.map((itinerary) => (
          <div
            key={itinerary.id}
            className="relative grid min-h-[20rem] overflow-hidden rounded-lg shadow-md bg-white"
          >
            <div className="absolute inset-0 bg-yellow-200 opacity-50 mx-auto" />
            <div className="relative p-6 z-10 flex flex-col justify-between h-full">
              <div className="mt-4 border border-gray-300 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-semibold text-black text-center">
                  {itinerary.city}, {itinerary.country}
                </h3>
                <p className="text-black mb-1 text-center">
                  {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                </p>
              </div>
              <div className="mt-8 border border-gray-300 bg-white rounded-lg shadow-md p-4 flex-grow">
                <div className="text-black mb-4 text-center">
                  <p className="font-bold">Why you're traveling:</p>
                  <p className="mt-1">{itinerary.description}</p>
                </div>
                <div className="mt-4 bg-white border border-black-500 rounded-lg p-4">
                  <div className="mt-4">
                    <h4 className="border-b border-gray-300 font-semibold mb-2">Comments:</h4>
                    <div className="max-h-48 overflow-y-auto">
                      {comments[itinerary.id] && comments[itinerary.id].length > 0 ? (
                        comments[itinerary.id].map(comment => (
                          <div key={comment.id} className="border-b border-gray-300 py-2">
                            <p className="text-md font-semibold">{comment.user.first_name} {comment.user.last_name}</p>
                            <p className="text-sm text-gray-600">{comment.content}</p>
                            <p className="text-xs text-gray-400">{formatDateWithTime(comment.created_at)}</p>
                            {user && user.id === comment.user_id && (
                              <div className="flex space-x-2 mt-2">
                                <button 
                                  className="text-blue-500 hover:underline"
                                  onClick={() => handleEditComment(comment.id, itinerary.id)}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteComment(comment.id, itinerary.id)}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-md text-gray-500">No comments yet.</p>
                      )}
                    </div>
                  </div>
                  <textarea
                    value={commentContent[itinerary.id] || ''}
                    onChange={(e) => setCommentContent({ ...commentContent, [itinerary.id]: e.target.value })}
                    placeholder="Leave a comment"
                    className="w-full h-20 border border-gray-300 rounded-lg p-2 mb-2 mt-4"
                  />
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleCommentSubmit(itinerary.id)}
                      className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <button
                    className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
                    onClick={() => handleEdit(itinerary.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(itinerary.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyItineraries;
