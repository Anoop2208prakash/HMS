import React, { useState } from 'react';
import axios from 'axios';
import { X, User, Mail, Phone, Calendar, Droplets, VenusAndMars } from 'lucide-react';
import '../../styles/pages/admin/RegisterPatientModal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegisterPatientModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'MALE',
    bloodType: 'A+',
    dob: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/patients/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Failed to register patient. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card">
        <div className="modal-header">
          <div className="title-area">
            <h2>Register New Patient</h2>
            <p>Create a permanent clinical record for a new patient.</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label><User size={16} /> Full Name</label>
              <input 
                type="text" required placeholder="e.g. Anoop Prakash"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input 
                type="email" required placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label><Phone size={16} /> Phone Number</label>
              <input 
                type="tel" required placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label><Calendar size={16} /> Date of Birth</label>
              <input 
                type="date" required
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label><VenusAndMars size={16} /> Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="form-group">
              <label><Droplets size={16} /> Blood Group</label>
              <select 
                value={formData.bloodType}
                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Residential Address</label>
            <textarea 
              placeholder="Enter full address..."
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Registering..." : "Create Patient Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatientModal;