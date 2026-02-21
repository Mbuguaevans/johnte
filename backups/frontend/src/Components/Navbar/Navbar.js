import React from 'react';
import { useNavigate } from 'react-router-dom';

// Helper: For users with no image
const getInitials = (name = "U") =>
  name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const backendUrl = "http://localhost:8000";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  const isLoggedIn = !!sessionStorage.getItem('access_token');

  const avatar = user?.profile_pic
    ? (user.profile_pic.startsWith("http") ? user.profile_pic : `${backendUrl}${user.profile_pic}`)
    : null;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <header className="sticky-header">
      <div className="header-container container">
        <div className="logo-area" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="material-symbols-outlined text-green">agriculture</span>
          <h1 className="logo">FarmHub</h1>
        </div>
        <nav className="nav-links d-none d-md-flex">
          <a href="#" onClick={e => { e.preventDefault(); navigate('/listings'); }}>Find Land</a>
          {user?.user_type === 'landowner' && (
            <a href="#" onClick={e => { e.preventDefault(); navigate('/add-land'); }}>List Land</a>
          )}
          <a href="/about" onClick={e => { e.preventDefault(); navigate('/about'); }}>About</a>
          <a href="#" onClick={e => e.preventDefault()}>Contact</a>
        </nav>
        <div className="header-right">
          {isLoggedIn ? (
            <div className="user-profile-area" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
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
              <button className="btn-signup btn-sm ms-2" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="btn-login d-none d-sm-block" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-signup" onClick={() => navigate('/register')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;