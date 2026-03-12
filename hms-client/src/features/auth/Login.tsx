import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Phone, Inbox, Heart } from 'lucide-react';
import '../../styles/features/Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  // 2. Handle the Sign In click
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send request to your backend
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (response.data.token) {
        // ✅ Success: Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // 🚀 Redirect to the dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      // ❌ Error: Show message from backend (e.g., "User not found" or "Invalid credentials")
      setError(err.response?.data?.message || 'Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-container">
        
        {/* Left Side: Branding */}
        <div className="login-branding-panel">
          <div className="logo-header">
            <Heart size={28} fill="white" />
            <h1>My Discounted Labs</h1>
          </div>
          <div className="graphic-overlay">
            <div className="nurse-circle"></div>
          </div>
          <p className="copyright-text">Copyright &copy; 2026, My Discounted Labs.</p>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-panel">
          <div className="tabs-header">
            <button type="button" className="tab-btn">Sign Up</button>
            <button type="button" className="tab-btn active">Sign In</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Display Error Message */}
            {error && <p className="error-text" style={{ color: '#ff4d6a', fontWeight: 'bold' }}>{error}</p>}

            <div className="form-group">
              <label>Email</label>
              <div className="input-container">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" 
                  placeholder="jane.doe@email.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-container">
                <Lock className="input-icon" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <button 
                  type="button" 
                  className="show-pass-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="signin-submit-btn" disabled={loading}>
              {loading ? 'Checking...' : 'Sign In'}
            </button>
          </form>

          <a href="#" className="signup-link-text">Don't have an Account?</a>

          <div className="contact-footer-info">
            <div className="contact-item"><Phone size={16} /> <span>9159912****67</span></div>
            <div className="contact-item"><Inbox size={16} /> <span>Info@mydiscountedlabs.in</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;