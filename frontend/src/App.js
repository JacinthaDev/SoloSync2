import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';  
import './index';
import AuthForm from './components/AuthForm';
import HomePage from './components/HomePage';  
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import EditItinerary from './components/EditItinerary';  
import Navbar from './components/Navbar';
import ItineraryShow from './components/ItineraryShow';
import EditComment from './components/EditComment';
import { UserProvider } from './UserContext';
import EditProfile from './components/EditProfile';
import OtherUserProfile from './components/OtherUserProfile';

function App() {
  return (
    <UserProvider>
      <Router>
        <Main />
      </Router>
    </UserProvider>
  );
}

function Main() {
  const location = useLocation();

  return (
    <div className="App bg-blue-200 min-h-screen">
      {location.pathname !== '/' && <Navbar />}
      <div className={location.pathname === '/' ? "mt-0" : "mt-8"}>
        <Routes>
          <Route path="/" element={<AuthForm />} /> 
          <Route path="/api/users/:user_id/itineraries" element={<HomePage />} />
          <Route path="/api/users/:user_id/itineraries/:id/edit" element={<EditItinerary />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/api/users/:user_id/itineraries/:itinerary_id/show" element={<ItineraryShow />} />
          <Route path="/api/users/:user_id/itineraries/:itinerary_id/comments/:comment_id/edit" element={<EditComment />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="/api/users/:user_id/user-profile" element={<OtherUserProfile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
