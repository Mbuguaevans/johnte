import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AuthFormMobile.css';

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Narok',
  'Laikipia', 'Kilifi', 'Uasin Gishu', 'Machakos', 'Kajiado',
  'Nyeri', 'Muranga', 'Kericho', 'Bomet', 'Kakamega', 'Bungoma',
];

const AuthFormMobile = ({ initialMode = 'login' }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const photoRef = useRef(null);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    first_name: '', last_name: '', username: '', email: '',
    password: '', password2: '', user_type: 'farmer',
    phone: '', county: '', profile_pic: null,
  });

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    setRegisterData({ ...registerData, profile_pic: file });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tokenRes = await axios.post('http://127.0.0.1:8000/api/auth/login/', loginData);
      const { access, refresh } = tokenRes.data;
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('refresh_token', refresh);
      const profileRes = await axios.get('http://127.0.0.1:8000/api/auth/profile/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      sessionStorage.setItem('user', JSON.stringify(profileRes.data));
      setSuccess('Login successful!');
      setTimeout(() => { window.location.href = '/listings'; }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.password2) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.keys(registerData).forEach(key => {
        if (registerData[key]) formData.append(key, registerData[key]);
      });
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', formData);
      sessionStorage.setItem('access_token', response.data.tokens.access);
      sessionStorage.setItem('refresh_token', response.data.tokens.refresh);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess('Account created!');
      setTimeout(() => { window.location.href = '/listings'; }, 1500);
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-mobile-root">
      <div className="auth-mobile-header">
        <div className="auth-mobile-logo">
           <span className="material-symbols-outlined">agriculture</span>
           <h1>FarmHub</h1>
        </div>
        <p>{isSignUp ? "Join Kenya's #1 Land Marketplace" : "Welcome back to FarmHub"}</p>
      </div>

      <div className="auth-mobile-card">
        <div className="auth-mobile-tabs">
          <button className={!isSignUp ? "active" : ""} onClick={() => {setIsSignUp(false); setError('');}}>Login</button>
          <button className={isSignUp ? "active" : ""} onClick={() => {setIsSignUp(true); setError('');}}>Sign Up</button>
        </div>

        <div className="auth-mobile-body">
          {error && <div className="auth-mobile-error">{error}</div>}
          {success && <div className="auth-mobile-success">{success}</div>}

          {!isSignUp ? (
            <form onSubmit={handleLogin}>
              <div className="auth-mobile-field">
                <label>Username</label>
                <input type="text" name="username" value={loginData.username} onChange={handleLoginChange} required placeholder="Your username" />
              </div>
              <div className="auth-mobile-field">
                <label>Password</label>
                <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required placeholder="••••••••" />
              </div>
              <button type="submit" className="auth-mobile-submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="auth-mobile-photo-pick" onClick={() => photoRef.current.click()}>
                {photoPreview ? <img src={photoPreview} alt="P" /> : <span>📷 Add Photo</span>}
                <input type="file" ref={photoRef} onChange={handlePhotoChange} style={{display:'none'}} />
              </div>
              <div className="auth-mobile-row">
                <div className="auth-mobile-field">
                  <label>First Name</label>
                  <input type="text" name="first_name" onChange={handleRegisterChange} required placeholder="John" />
                </div>
                <div className="auth-mobile-field">
                  <label>Last Name</label>
                  <input type="text" name="last_name" onChange={handleRegisterChange} required placeholder="Gitahi" />
                </div>
              </div>
              <div className="auth-mobile-field">
                <label>Username</label>
                <input type="text" name="username" onChange={handleRegisterChange} required placeholder="johng" />
              </div>
              <div className="auth-mobile-field">
                <label>Email</label>
                <input type="email" name="email" onChange={handleRegisterChange} required placeholder="john@email.com" />
              </div>
              <div className="auth-mobile-field">
                <label>Password</label>
                <input type="password" name="password" onChange={handleRegisterChange} required placeholder="Min 8 chars" />
              </div>
              <div className="auth-mobile-field">
                <label>Confirm Password</label>
                <input type="password" name="password2" onChange={handleRegisterChange} required placeholder="Re-enter" />
              </div>
              <div className="auth-mobile-field">
                <label>I am a</label>
                <select name="user_type" onChange={handleRegisterChange}>
                  <option value="farmer">Farmer</option>
                  <option value="landowner">Landowner</option>
                </select>
              </div>
              <div className="auth-mobile-field">
                <label>Phone (M-Pesa)</label>
                <input type="tel" name="phone" onChange={handleRegisterChange} required placeholder="07XX XXX XXX" />
              </div>
              <div className="auth-mobile-field">
                <label>County</label>
                <select name="county" onChange={handleRegisterChange} required>
                  <option value="">Select County</option>
                  {COUNTIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="auth-mobile-submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFormMobile;