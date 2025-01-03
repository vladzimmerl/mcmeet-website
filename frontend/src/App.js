import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './app.css';
import Navbar from './components/navbar/Navbar';
import CreateBooking from "./pages/createBooking";
import Dashboard from "./pages/dashboard";
import RequestBooking from "./pages/requestBooking";
import AcceptBooking from './pages/acceptBooking';
import Login from './pages/login';
import Register from './pages/register';
import Landing from './pages/landing';
import ProtectedPage from './components/ProtectedPage';
import IncomingRequests from './pages/incomingRequests';

function App() {

  return (
    <Router>
      <Navbar />
      <div className='content'>
        <Routes>
            <Route exact path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
            <Route path="/create-booking" element={<ProtectedPage><CreateBooking /></ProtectedPage>} />
            <Route path="/request-booking/:target" element={<ProtectedPage><RequestBooking /></ProtectedPage>} />
            <Route path="/incoming-requests" element={<ProtectedPage><IncomingRequests /></ProtectedPage>} />
            <Route path="/accept-booking/:id" element={<AcceptBooking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />
        </Routes>
      </div>
      </Router>
  );
}

export default App;
