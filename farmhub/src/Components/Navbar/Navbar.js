import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ onProfileClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get user from sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const isLoggedIn = !!sessionStorage.getItem('access_token');
  const userType = user.user_type || 'farmer';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const getInitials = (name = "U") =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const isTransparentPage = ['/', '/login', '/register'].includes(location.pathname);

  const navbarClass = `sticky-header ${isScrolled || !isTransparentPage ? 'scrolled' : 'transparent'}`;

  return (
    <>
      <header className={navbarClass}>
        <div className="header-container container">
          {/* Logo */}
          <div className="logo-area" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className={`material-symbols-outlined ${!isScrolled && isTransparentPage ? 'text-white' : 'text-green'}`}>agriculture</span>
            <h1 className={`logo ${!isScrolled && isTransparentPage ? 'text-white' : ''}`}>FarmHub</h1>
          </div>

          {/* Mobile Toggler */}
          <button 
            className="navbar-toggler d-md-none border-0 text-white" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mainNavbarContent"
            style={{ color: !isScrolled && isTransparentPage ? 'white' : '#294821' }}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse d-md-block" id="mainNavbarContent">
            <nav className={`nav-links flex-column flex-md-row ${!isScrolled && isTransparentPage ? 'links-white' : ''}`}>
              {location.pathname === '/' ? (
                <>
                  <a href="#home">Home</a>
                  <a href="#features">Features</a>
                  <a href="#contact">Contact</a>
                </>
              ) : (
                <>
                  <a 
                    href="#" 
                    className={location.pathname === '/listings' ? 'active' : ''} 
                    onClick={e => { e.preventDefault(); navigate('/listings'); }}
                  >
                    Marketplace
                  </a>
                  
                  <a 
                    href="#" 
                    className={location.pathname === '/about' ? 'active' : ''} 
                    onClick={e => { e.preventDefault(); navigate('/about'); }}
                  >
                    About Us
                  </a>
                </>
              )}
              
              {/* Mobile Only Logout/Profile */}
              {isLoggedIn && (
                <div className="d-md-none mt-3 pt-3 border-top">
                   <a href="#" onClick={(e) => { e.preventDefault(); onProfileClick(); }}>My Profile</a>
                   <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="text-danger">Logout</a>
                </div>
              )}
            </nav>
          </div>

          {/* Desktop Right Side Area */}
          <div className="header-right d-none d-md-flex">
            {isLoggedIn ? (
              <>
                {userType === 'landowner' && (
                  <button 
                    className="btn-signup btn-sm me-3" 
                    onClick={() => navigate('/add-land')}
                  >
                    + List Land
                  </button>
                )}
                <div className="user-profile-area" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
                  <div className="avatar-circle-small">
                    {user.profile_pic ? (
                      <img 
                        src={user.profile_pic.startsWith('http') ? user.profile_pic : `https://mbuguaevans1.pythonanywhere.com${user.profile_pic}`} 
                        alt="Profile" 
                        className="avatar-img" 
                      />
                    ) : (
                      <span className="avatar-initials-small">{getInitials(user.first_name || user.username)}</span>
                    )}
                  </div>
                  <div className="profile-labels d-none d-sm-flex">
                    <span className="profile-name">{user.first_name || user.username}</span>
                    <span className="profile-role" style={{ fontSize: '10px', color: '#28a745', fontWeight: 'bold' }}>
                      {userType.toUpperCase()}
                    </span>
                  </div>
                  <button className="btn-signup btn-sm ms-2" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <button className={`btn-login ${!isScrolled && isTransparentPage ? 'text-white' : ''}`} onClick={() => navigate('/login')}>Login</button>
                <button className="btn-signup" onClick={() => navigate('/register')}>Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;