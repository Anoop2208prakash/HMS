import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // 🚀 Added AxiosError for type safety
import { Mail, Lock, Eye, EyeOff, Heart, ArrowRight, ShieldCheck } from 'lucide-react';
import HMSAlert from '../../components/common/HMSAlert'; 
import HMSLoader from '../../components/common/HMSLoader'; 
import '../../styles/features/Login.scss';

// Define the shape of your backend error response
interface ApiError {
  message: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState<{ 
    show: boolean; 
    msg: string; 
    type: 'success' | 'error' 
  }>({
    show: false,
    msg: '',
    type: 'error'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Clear previous alerts
    setAlert(prev => ({ ...prev, show: false }));

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setAlert({ show: true, msg: 'Welcome back! Redirecting...', type: 'success' });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      // 🚀 FIXED: No more 'any' error. Using type casting with AxiosError.
      const error = err as AxiosError<ApiError>;
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      
      setAlert({
        show: true,
        msg: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      {/* Global Notification */}
      <HMSAlert 
        severity={alert.type} 
        isOpen={alert.show} 
        message={alert.msg} 
        onClose={() => setAlert(prev => ({ ...prev, show: false }))} 
      />
      
      {/* Background Stylings */}
      <div className="mesh-gradient"></div>
      <div className="floating-blob blob-1"></div>
      <div className="floating-blob blob-2"></div>

      <div className="glass-login-card">
        {/* Branding & Welcome */}
        <div className="login-intro">
          <div className="brand-logo">
            <Heart size={32} fill="#4f64ff" color="#4f64ff" />
            <span>MDL</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Access your health dashboard and lab reports.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="input-field">
            <Mail size={18} className="field-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="input-field">
            <Lock size={18} className="field-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button 
              type="button" 
              className="toggle-pass" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> <span>Remember me</span>
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="glow-btn" disabled={loading}>
            {loading ? (
              // 🚀 FIXED: Color is now "info" to pass your component's validation
              <HMSLoader size={20} color="info" /> 
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <div className="signup-prompt">
          <p>New to My Discounted Labs?</p>
          <Link to="/register" className="register-text">Create an account</Link>
        </div>

        {/* Security Badge */}
        <div className="trust-badge">
          <ShieldCheck size={14} /> <span>Secure HIPAA Compliant Platform</span>
        </div>
      </div>
    </div>
  );
};

export default Login;