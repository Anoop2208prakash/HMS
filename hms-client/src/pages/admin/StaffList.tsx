import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Filter,
  Download
} from 'lucide-react';
import type { GridColDef } from '@mui/x-data-grid';

import HMSTable from '../../components/common/HMSTable';
import HMSPagination from '../../components/common/HMSPagination';
import HMSSkeleton from '../../components/common/HMSSkeleton';
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

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/staff-list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffList(response.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    return staffList.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffList, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Staff Member',
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <div className="user-info-cell">
          {params.row.avatar ? (
            <img src={params.row.avatar} alt={params.row.name} className="user-avatar-img" />
          ) : (
            <div className="user-avatar">{params.row.name.charAt(0)}</div>
          )}
          <div className="user-meta">
            <p className="user-name">{params.row.name}</p>
            <p className="user-id">ID: {params.row.id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span className={`role-badge ${params.value.toLowerCase()}`}>
          <ShieldCheck size={14} /> {params.value}
        </span>
      )
    },
    {
      field: 'email',
      headerName: 'Contact Info',
      flex: 2,
      minWidth: 220,
      renderCell: (params) => (
        <div className="contact-cell">
          <div className="contact-item"><Mail size={14} /> {params.row.email}</div>
          {params.row.phone && <div className="contact-item"><Phone size={14} /> {params.row.phone}</div>}
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: () => <span className="status-tag active">Active</span>
    },
    {
      field: 'createdAt',
      headerName: 'Joined Date',
      width: 150,
      valueFormatter: (value) => new Date(value as string).toLocaleDateString('en-GB')
    },
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      width: 80,
      renderCell: () => (
        <div className="action-wrapper">
          <button className="action-dot-btn" title="More Options"><MoreVertical size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="staff-page-container">
      <div className="page-header">
        <div className="header-titles">
          <h1>Staff Management</h1>
          <p>Real-time hospital personnel directory and roles.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary"><Download size={18} /> Export</button>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} /> Add Staff
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

      <div className="table-section-card">
        {loading ? (
          <div className="skeleton-container">
            <HMSSkeleton variant="rounded" height={64} count={6} />
          </div>
        ) : (
          <>
            <HMSTable 
              rows={filteredStaff} 
              columns={columns} 
              checkboxSelection={true}
              // 🚀 FIX: Force row height to handle two lines of text
              rowHeight={80} 
            />
            
            <div className="pagination-footer">
               <HMSPagination 
                 count={Math.ceil(filteredStaff.length / pageSize)} 
                 page={page} 
                 onChange={(_, val) => setPage(val)} 
               />
            </div>
          </>
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