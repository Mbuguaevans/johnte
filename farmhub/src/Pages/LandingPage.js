import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../Components/Herosection/Herosection';
import LandingFeatures from '../Components/Section3/Section3';
import Footer from '../Components/Footer/Footer';
import './LandingPage.css';

// Helper: For users with no image
const getInitials = (name = "U") =>
  name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const backendUrl = "https://mbuguaevans1.pythonanywhere.com";

// Fetches user profile, updates sessionStorage and state
const fetchProfile = async () => {
  const token = sessionStorage.getItem('access_token');
  if (!token) return null;
  try {
    const res = await fetch(`${backendUrl}/api/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const isLoggedIn = sessionStorage.getItem('access_token');
    try {
      return isLoggedIn ? JSON.parse(sessionStorage.getItem("user") || "null") : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('access_token');
    if (isLoggedIn) {
      fetchProfile().then(data => {
        if (data) {
          setUser(data);
          sessionStorage.setItem("user", JSON.stringify(data));
        }
      });
    }
  }, []);

  const isLoggedIn = !!user;

  // Avatar logic: photo if present, else initials
  const avatar = user?.profile_pic
    ? (user.profile_pic.startsWith("http") ? user.profile_pic : `${backendUrl}${user.profile_pic}`)
    : null;

  const handleLogin = () => navigate('/login');
  const handleSignUp = () => navigate('/register');
  const handleFindLand = () => isLoggedIn ? navigate('/listings') : navigate('/login');
  const handleListLand = () => isLoggedIn ? navigate('/add-land') : navigate('/login');
  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="landing-page">
      <HeroSection />
      <LandingFeatures />
      <Footer />
    </div>
  );
};

export default LandingPage;