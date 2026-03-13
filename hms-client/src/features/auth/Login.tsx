import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Phone, Inbox, Heart } from 'lucide-react';
import HMSAlert from '../../components/common/HMSAlert'; 
import HMSLoader from '../../components/common/HMSLoader'; 
import '../../styles/features/Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({ 
    show: false, 
    msg: '', 
    type: 'error' 
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (alert.show) setAlert(prev => ({ ...prev, show: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, msg: '', type: 'error' });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Show success alert before navigating
        setAlert({ show: true, msg: 'Login Successful! Redirecting...', type: 'success' });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      // ✅ Handled 'any' type error and set alert
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your connection.';
      setAlert({ show: true, msg: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Global Alert Placement */}
      <HMSAlert 
        severity={alert.type} 
        isOpen={alert.show} 
        message={alert.msg} 
        onClose={() => setAlert(prev => ({ ...prev, show: false }))} 
      />

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
            <div className="form-group">
              <label>Email</label>
              <div className="input-container">
                <Mail className="input-icon" size={20} />
                <input 
                  type="email" 
                  name="email" 
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
                  name="password" 
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
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <HMSLoader size={20} color="inherit" />
                  <span>Verifying...</span>
                </div>
              ) : 'Sign In'}
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