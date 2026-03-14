import React, { useState } from 'react';
import { X, User, Mail, Lock, Camera, Stethoscope } from 'lucide-react';
import axios from 'axios';
import HMSSelect from '../../components/common/HMSSelect';
import HMSAlert from '../../components/common/HMSAlert';
import HMSLoader from '../../components/common/HMSLoader';
import '../../styles/pages/admin/AddStaffModal.scss';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
    show: false, msg: '', type: 'success'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
    department: '', // 🚀 New field for Doctors
  });

  if (!isOpen) return null;

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

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      
      // 🚀 Only send department if the user is a Doctor
      if (formData.role === 'DOCTOR') {
        data.append('department', formData.department);
      }

      if (selectedFile) {
        data.append('avatar', selectedFile);
      }

      await axios.post("http://localhost:5000/api/auth/register", data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlert({ show: true, msg: "Staff account created successfully!", type: "success" });
      
      setTimeout(() => { 
        onSuccess(); 
        onClose(); 
        setPreview(null);
        setSelectedFile(null);
        setFormData({ name: '', email: '', password: '', role: 'STAFF', department: '' });
      }, 1500);

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to create account.";
      setAlert({ show: true, msg: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <HMSAlert 
        severity={alert.type} 
        isOpen={alert.show} 
        message={alert.msg} 
        onClose={() => setAlert({ ...alert, show: false })} 
      />

      <div className="modal-content">
        <div className="modal-header">
          <div className="header-text">
            <h2>Add New Staff</h2>
            <p>Complete the profile to generate access credentials.</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="add-staff-form">
          <div className="photo-upload-container">
            <div className="avatar-preview">
              {preview ? <img src={preview} alt="Preview" /> : <User size={40} />}
            </div>
            <label htmlFor="staff-photo" className="upload-label">
              <Camera size={16} /> {preview ? 'Change Photo' : 'Upload Photo'}
              <input type="file" id="staff-photo" hidden onChange={handlePhotoChange} accept="image/*" />
            </label>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label><User size={16} /> Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Nayanthara" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input 
                type="email" 
                placeholder="doctor1@hospital.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Temporary Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <div className="form-group">
               <label><Lock size={16} /> Select Role</label>
              <HMSSelect
                value={formData.role} 
                onChange={(val) => setFormData((prev) => ({ ...prev, role: val }))} 
                options={[
                  { value: "STAFF", label: "General Staff" }, 
                  { value: "DOCTOR", label: "Medical Doctor" }, 
                  { value: "ADMIN", label: "System Administrator" }
                ]} 
                fullWidth 
              />
            </div>

            {/* 🚀 CONDITIONAL DEPARTMENT FIELD */}
            {formData.role === 'DOCTOR' && (
              <div className="form-group animate-slide-down">
                <label><Stethoscope size={16} /> Medical Department</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cardiology, Neurology" 
                  required 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})} 
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HMSLoader size={18} color="inherit" />
                  <span>Creating...</span>
                </div>
              ) : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;