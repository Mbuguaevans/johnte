import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthFormMobile from './AuthFormMobile';
import './AuthForm.css';

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Narok',
  'Laikipia', 'Kilifi', 'Uasin Gishu', 'Machakos', 'Kajiado',
  'Nyeri', 'Muranga', 'Kericho', 'Bomet', 'Kakamega', 'Bungoma',
];

const AuthForm = ({ initialMode = 'login' }) => {
  const [isSignUp, setIsSignUp]       = useState(initialMode === 'signup');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoRef                      = useRef(null);

  // Adaptive Rendering Logic
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── LOGIN STATE ──
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // ── REGISTER STATE ──
  const [registerData, setRegisterData] = useState({
    first_name:  '',
    last_name:   '',
    username:    '',
    email:       '',
    password:    '',
    password2:   '',
    user_type:   'farmer',
    phone:       '',
    county:      '',
    profile_pic: null,
  });

  if (isMobile) {
    return <AuthFormMobile initialMode={initialMode} />;
  }

  // ── HANDLERS ──
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    setRegisterData({ ...registerData, profile_pic: file });
  };

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tokenRes = await axios.post('https://mbuguaevans1.pythonanywhere.com/api/auth/login/', {
        username: loginData.username,
        password: loginData.password,
      });

      const { access, refresh } = tokenRes.data;
      sessionStorage.setItem('access_token',  access);
      sessionStorage.setItem('refresh_token', refresh);

      const profileRes = await axios.get('https://mbuguaevans1.pythonanywhere.com/api/auth/profile/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      sessionStorage.setItem('user', JSON.stringify(profileRes.data));

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => { window.location.href = '/listings'; }, 1000);

    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTER ──
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.password2) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('first_name',  registerData.first_name);
      formData.append('last_name',   registerData.last_name);
      formData.append('username',    registerData.username);
      formData.append('email',       registerData.email);
      formData.append('password',    registerData.password);
      formData.append('password2',   registerData.password2);
      formData.append('user_type',   registerData.user_type);
      formData.append('phone',       registerData.phone);
      formData.append('county',      registerData.county);
      if (registerData.profile_pic) {
        formData.append('profile_pic', registerData.profile_pic);
      }

      const response = await axios.post(
        'https://mbuguaevans1.pythonanywhere.com/api/auth/register/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      sessionStorage.setItem('access_token',  response.data.tokens.access);
      sessionStorage.setItem('refresh_token', response.data.tokens.refresh);
      sessionStorage.setItem('user',          JSON.stringify(response.data.user));

      setSuccess('Account created! Redirecting...');
      setTimeout(() => { window.location.href = '/listings'; }, 1500);

    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          const first = Object.values(data)[0];
          setError(Array.isArray(first) ? first[0] : String(first));
        } else {
          setError(String(data));
        }
      } else {
        setError('Registration failed. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <div className={`auth-cont ${isSignUp ? 's--signup' : ''}`}>
        <form className="auth-form auth-sign-in" onSubmit={handleLogin}>
          <h2>Welcome Back!</h2>
          <div className="auth-label">
            <span>Username</span>
            <input className="auth-input" type="text" name="username" value={loginData.username} onChange={handleLoginChange} required placeholder="Enter your username" />
          </div>
          <div className="auth-label">
            <span>Password</span>
            <input className="auth-input" type="password" name="password" value={loginData.password} onChange={handleLoginChange} required placeholder="••••••••" />
          </div>
          <p className="auth-forgot-pass">Forgot password?</p>
          <button type="submit" className="auth-btn auth-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <div className="auth-error">{error && !isSignUp && error}</div>
          <div className="auth-success">{success && !isSignUp && success}</div>
        </form>

        <div className="auth-sub-cont">
          <div className="auth-img">
            <div className="auth-img__text m--up">
              <h2>New to FarmHub?</h2>
              <p>Join Kenya's #1 agricultural land platform today!</p>
            </div>
            <div className="auth-img__text m--in">
              <h2>Welcome Back!</h2>
              <p>Login to manage your farms and listings</p>
            </div>
            <button className="auth-img__btn" onClick={toggleForm} type="button">
              <span className="m--up">Sign Up</span>
              <span className="m--in">Sign In</span>
            </button>
          </div>

          <form className="auth-form auth-sign-up" onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <div className="auth-photo-wrap">
              <div className="auth-photo-circle" onClick={() => photoRef.current.click()} title="Click to upload photo">
                {photoPreview ? <img src={photoPreview} alt="Preview" className="auth-photo-preview" /> : <div className="auth-photo-placeholder"><span>📷</span><p>Add Photo</p></div>}
              </div>
              <input type="file" accept="image/*" ref={photoRef} onChange={handlePhotoChange} style={{ display: 'none' }} />
            </div>
            <div className="auth-row">
              <div className="auth-label"><span>First Name</span><input className="auth-input" type="text" name="first_name" value={registerData.first_name} onChange={handleRegisterChange} required placeholder="John" /></div>
              <div className="auth-label"><span>Last Name</span><input className="auth-input" type="text" name="last_name" value={registerData.last_name} onChange={handleRegisterChange} required placeholder="Gitahi" /></div>
            </div>
            <div className="auth-label"><span>Username</span><input className="auth-input" type="text" name="username" value={registerData.username} onChange={handleRegisterChange} required placeholder="Choose a username" /></div>
            <div className="auth-label"><span>Email</span><input className="auth-input" type="email" name="email" value={registerData.email} onChange={handleRegisterChange} required placeholder="your@email.com" /></div>
            <div className="auth-row">
              <div className="auth-label"><span>Password</span><input className="auth-input" type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required minLength="8" placeholder="Min 8 chars" /></div>
              <div className="auth-label"><span>Confirm Password</span><input className="auth-input" type="password" name="password2" value={registerData.password2} onChange={handleRegisterChange} required placeholder="Re-enter" /></div>
            </div>
            <div className="auth-label">
              <span>I am a</span>
              <select className="auth-input auth-select" name="user_type" value={registerData.user_type} onChange={handleRegisterChange}>
                <option value="farmer">🌾 Farmer (Looking for land)</option>
                <option value="landowner">🏡 Land Owner (Have land to lease)</option>
              </select>
            </div>
            <div className="auth-row">
              <div className="auth-label"><span>Phone</span><input className="auth-input" type="tel" name="phone" value={registerData.phone} onChange={handleRegisterChange} placeholder="+254 7XX XXX XXX" /></div>
              <div className="auth-label">
                <span>County</span>
                <select className="auth-input auth-select" name="county" value={registerData.county} onChange={handleRegisterChange}>
                  <option value="">Select county</option>
                  {COUNTIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="auth-btn auth-submit" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</button>
            <div className="auth-error">{error && isSignUp && error}</div>
            <div className="auth-success">{success && isSignUp && success}</div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;