import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import AddStaffModal from './AddStaffModal';
import '../../styles/pages/admin/StaffList.scss';

interface StaffMember {
  id: string;
  name: string;
  role: 'ADMIN' | 'DOCTOR' | 'STAFF';
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

const StaffList = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/staff-list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staffList.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="staff-page-container">
      <div className="page-header">
        <div className="header-titles">
          <h1>Staff Management</h1>
          <p>Real-time list of hospital employees retrieved from the database.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary"><Download size={18} /> Export</button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} /> Add New Staff
          </button>
        </div>
      </div>

      <div className="table-controls">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, role, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn"><Filter size={18} /> Filter</button>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="table-loader">
            <Loader2 className="spinner" size={40} />
            <p>Syncing with Database...</p>
          </div>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Contact Info</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? filteredStaff.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div className="user-info-cell">
                      {staff.avatar ? (
                        <img src={staff.avatar} alt="" className="user-avatar-img" />
                      ) : (
                        <div className="user-avatar">{staff.name.charAt(0)}</div>
                      )}
                      <div className="user-meta">
                        <p className="user-name">{staff.name}</p>
                        <p className="user-id">ID: {staff.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${staff.role.toLowerCase()}`}>
                      <ShieldCheck size={14} /> {staff.role}
                    </span>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="contact-item"><Mail size={14} /> {staff.email}</div>
                      {staff.phone && <div className="contact-item"><Phone size={14} /> {staff.phone}</div>}
                    </div>
                  </td>
                  <td><span className="status-tag active">Active</span></td>
                  <td>{new Date(staff.createdAt).toLocaleDateString('en-GB')}</td>
                  <td>
                    <button className="action-dot-btn"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="no-data">No staff members found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AddStaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchStaff} 
      />
    </div>
  );
};

export default StaffList;