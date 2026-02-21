import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import NavbarComponent from "./Components/Navbar/Navbar";
import AuthForm from "./Components/Section4/AuthForm";
import LandingPage from "./Pages/LandingPage";
import Listings from "./Pages/listing";
import InvestmentPlans from "./Pages/InvestmentPlans";
import AgriTech from "./Pages/AgriTech";
import AboutUs from "./Pages/AboutUs";
import AddLand from "./Pages/AddLand";

// Auth logic
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem('access_token');
  return token ? <Navigate to="/listings" /> : children;
};

// Landowner-only route guard
const LandownerRoute = ({ children }) => {
  const token = sessionStorage.getItem('access_token');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isLandowner = user.user_type === 'landowner' || user.role === 'landowner';

  if (!token) return <Navigate to="/login" />;
  if (!isLandowner) return <Navigate to="/listings" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* HOME */}
          <Route path="/" element={
              <LandingPage />
          } />

          {/* AUTH ROUTES */}
          <Route path="/login" element={
            <PublicRoute>
              <>
                <NavbarComponent />
                <AuthForm />
              </>
            </PublicRoute>
          } />

          <Route path="/register" element={
            <PublicRoute>
              <>
                <NavbarComponent />
                <AuthForm initialMode="signup" />
              </>
            </PublicRoute>
          } />

          {/* PROTECTED ROUTES */}
          <Route path="/listings" element={
            <PrivateRoute>
              <Listings />
            </PrivateRoute>
          } />

          <Route path="/add-land" element={
            <LandownerRoute>
              <>
                <NavbarComponent />
                <AddLand />
              </>
            </LandownerRoute>
          } />

          <Route path="/investments" element={
            <PrivateRoute>
              <InvestmentPlans />
            </PrivateRoute>
          } />

          <Route path="/agritech" element={
            <PrivateRoute>
              <AgriTech />
            </PrivateRoute>
          } />
          <Route path="/about" element={<PrivateRoute><AboutUs /></PrivateRoute>} />

          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;