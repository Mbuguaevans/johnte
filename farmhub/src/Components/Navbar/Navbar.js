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
            className="navbar-toggler d-md-none border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mainNavbarContent"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Navigation Links (Collapsible) */}
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
            </nav>
          </div>

          {/* User Profile / Auth Area (Always Visible Actions) */}
          <div className="header-right d-flex align-items-center gap-2">
            {isLoggedIn ? (
              <>
                {userType === 'landowner' && (
                  <button 
                    className="btn-signup btn-sm px-2 px-md-3" 
                    onClick={() => navigate('/add-land')}
                    title="List New Land"
                  >
                    <span className="d-none d-sm-inline">+ List Land</span>
                    <span className="d-inline d-sm-none">+</span>
                  </button>
                )}
                <div className="user-profile-area px-2" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
                  <div className="avatar-circle-small" style={{ width: '28px', height: '28px' }}>
                    {user.profile_pic ? (
                      <img 
                        src={user.profile_pic.startsWith('http') ? user.profile_pic : `https://mbuguaevans1.pythonanywhere.com${user.profile_pic}`} 
                        alt="P" 
                        className="avatar-img" 
                      />
                    ) : (
                      <span className="avatar-initials-small" style={{ fontSize: '10px' }}>{getInitials(user.first_name || user.username)}</span>
                    )}
                  </div>
                  <div className="profile-labels d-none d-lg-flex">
                    <span className="profile-name">{user.first_name || user.username}</span>
                  </div>
                </div>
                <button className="btn-login btn-sm px-1 px-md-2" onClick={handleLogout} title="Logout">
                   <span className="material-symbols-outlined small">logout</span>
                </button>
              </>
            ) : (
              <div className="d-flex gap-1 gap-md-2">
                <button className={`btn-login btn-sm ${!isScrolled && isTransparentPage ? 'text-white' : ''}`} onClick={() => navigate('/login')}>Login</button>
                <button className="btn-signup btn-sm" onClick={() => navigate('/register')}>Sign Up</button>
              </div>
            )}

            {/* Mobile Toggler (Last on mobile) */}
            <button 
              className="navbar-toggler d-md-none border-0 p-0" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#mainNavbarContent"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>menu</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;