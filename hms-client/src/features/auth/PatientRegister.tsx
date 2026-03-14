import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Lock, Phone, MapPin, Calendar, HeartPulse, Camera, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import axios, { AxiosError } from 'axios';
import HMSSelect from '../../components/common/HMSSelect';
import HMSAlert from '../../components/common/HMSAlert';
import HMSLoader from '../../components/common/HMSLoader';
import '../../styles/features/PatientRegister.scss';

const PatientRegister: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodType: '',
    address: '',
    dob: '',
    gender: 'Other'
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('role', 'PATIENT');
    if (selectedFile) data.append('avatar', selectedFile);

    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      setAlert({ show: true, msg: "Account created! Redirecting to login...", type: 'success' });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setAlert({ show: true, msg: error.response?.data?.message || "Registration failed", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-reg-container">
      <HMSAlert isOpen={alert.show} message={alert.msg} severity={alert.type} onClose={() => setAlert({ ...alert, show: false })} />
      
      {/* Background Decor */}
      <div className="mesh-gradient"></div>

      <div className="glass-reg-card">
        <Link to="/" className="back-link"><ArrowLeft size={18} /> Back to Login</Link>
        
        <div className="reg-header">
          <h1>Create Patient Account</h1>
          <p>Join My Discounted Labs for seamless health management.</p>
        </div>

        <form onSubmit={handleSubmit} className="modern-reg-form">
          {/* Profile Photo Upload */}
          <div className="avatar-upload-wrapper">
            <div className="avatar-preview">
              {preview ? <img src={preview} alt="Avatar" /> : <User size={40} />}
              <label htmlFor="file-input" className="upload-badge"><Camera size={14} /></label>
            </div>
            <input id="file-input" type="file" hidden onChange={handlePhotoChange} accept="image/*" />
            <span>Profile Picture</span>
          </div>

          <div className="form-grid">
            {/* Column 1: Account Security */}
            <div className="form-column">
              <h3 className="section-title"><ShieldCheck size={16} /> Account Security</h3>
              <div className="input-field">
                <User size={18} className="field-icon" />
                <input placeholder="Full Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="input-field">
                <Mail size={18} className="field-icon" />
                <input type="email" placeholder="Email Address" required onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="input-field">
                <Lock size={18} className="field-icon" />
                <input type="password" placeholder="Create Password" required onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>

            {/* Column 2: Medical & Contact */}
            <div className="form-column">
              <h3 className="section-title"><HeartPulse size={16} /> Medical Profile</h3>
              <div className="input-row">
                <div className="input-field">
                  <Calendar size={18} className="field-icon" />
                  <input type="date" required onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div className="input-field no-icon">
                  <HMSSelect 
                    value={formData.bloodType}
                    onChange={val => setFormData({...formData, bloodType: val})}
                    options={[
                      {value: 'A+', label: 'A+'}, {value: 'B+', label: 'B+'}, {value: 'O+', label: 'O+'}, {value: 'AB+', label: 'AB+'}
                    ]}
                    placeholder="Blood"
                    fullWidth
                  />
                </div>
              </div>
              <div className="input-field">
                <Phone size={18} className="field-icon" />
                <input type="tel" placeholder="Phone Number" required onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="input-field">
                <MapPin size={18} className="field-icon" />
                <input placeholder="Current Address" required onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="glow-submit-btn" disabled={loading}>
            {loading ? <HMSLoader size={20} color="info" /> : "Complete Registration"}
          </button>
        </form>

        <div className="reg-footer">
          <p>Protected by 256-bit SSL encryption</p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;