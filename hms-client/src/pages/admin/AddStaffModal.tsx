import React, { useState } from 'react';
import { X, User, Mail, Lock, Camera} from 'lucide-react';
import axios from 'axios';
import HMSSelect from '../../components/common/HMSSelect';
import HMSAlert from '../../components/common/HMSAlert';
import HMSLoader from '../../components/common/HMSLoader';
import '../../styles/pages/admin/AddStaffModal.scss';

// Configuration
const CLOUDINARY_UPLOAD_PRESET = "hms_profiles"; 
const CLOUDINARY_CLOUD_NAME = "your_cloud_name"; 

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store the actual file
  const [preview, setPreview] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
    show: false, msg: '', type: 'success'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
  });

  if (!isOpen) return null;

  // 1. Just handle the local preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 2. The combined upload + submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let avatarUrl = "";

    try {
      // Step A: Upload to Cloudinary first if a file was selected
      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          data
        );
        avatarUrl = cloudinaryRes.data.secure_url;
      }

      // Step B: Send everything to your backend
      const finalData = { ...formData, avatar: avatarUrl };
      await axios.post("http://localhost:5000/api/auth/register", finalData);

      setAlert({ show: true, msg: "Staff account created successfully!", type: "success" });
      setTimeout(() => { onSuccess(); onClose(); }, 1500);

    } catch (error: any) {
      console.error("Submission Error:", error);
      setAlert({ 
        show: true, 
        msg: error.response?.data?.message || "Failed to create account. Check connection.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <HMSAlert severity={alert.type} isOpen={alert.show} message={alert.msg} onClose={() => setAlert({ ...alert, show: false })} />

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
              <input type="text" placeholder="Anoop Prakash" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input type="email" placeholder="anoop@hms.com" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Temporary Password</label>
              <input type="password" placeholder="••••••••" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="form-group">
              <HMSSelect 
                label="Select Role" 
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