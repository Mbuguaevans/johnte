import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../Components/Herosection/Herosection';
import LandingFeatures from '../Components/Section3/Section3';
import Footer from '../Components/Footer/Footer';
import './LandingPage.css';

// Helper: For users with no image
const getInitials = (name = "U") =>
  name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const backendUrl = "http://localhost:8000";

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
      {/* Header */}
      <header className="sticky-header">
        <div className="header-container container">
          <div className="logo-area" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined text-green">agriculture</span>
            <h1 className="logo">FarmHub</h1>
          </div>
          <nav className="nav-links d-none d-md-flex">
            <a href="#" onClick={e => { e.preventDefault(); handleFindLand(); }}>Find Land</a>
            {user?.user_type === 'landowner' && (
              <a href="#" onClick={e => { e.preventDefault(); handleListLand(); }}>List Land</a>
            )}
            <a href="/about" onClick={e => { e.preventDefault(); navigate('/about'); }}>About</a>
            <a href="#" onClick={e => e.preventDefault()}>Contact</a>
          </nav>
          <div className="header-right">
            {isLoggedIn ? (
              <div className="user-profile-area">
                <div className="avatar-circle-small">
                  {avatar ? (
                    <img src={avatar} alt={user?.name || "Profile"} className="avatar-img" />
                  ) : (
                    <span className="avatar-initials-small">{getInitials(user?.name || user?.username)}</span>
                  )}
                </div>
                <div className="profile-labels d-none d-sm-flex">
                  <span className="profile-name">{user?.first_name || user?.username}</span>
                </div>
                <button className="btn-signup btn-sm ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button className="btn-login d-none d-sm-block" onClick={handleLogin}>Login</button>
                <button className="btn-signup" onClick={handleSignUp}>Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      <HeroSection />
      <LandingFeatures />
      <Footer />
    </div>
  );
};

export default LandingPage;