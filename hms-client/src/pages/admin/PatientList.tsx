import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Filter,
  Download,
  Calendar
} from 'lucide-react';

import type { GridColDef } from '@mui/x-data-grid';

import HMSTable from '../../components/common/HMSTable';
import HMSPagination from '../../components/common/HMSPagination';
import HMSSkeleton from '../../components/common/HMSSkeleton';
import RegisterPatientModal from './RegisterPatientModal';

import '../../styles/pages/admin/PatientList.scss';

interface PatientVitals {
  status: string;
  type_info: string;
  color: string;
}

interface PatientMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender: string;
  bloodType: string;
  dob: string;
  avatar?: string;
  lastVisit?: string;
  vitals: PatientVitals;
}

const PatientList: React.FC = () => {
  const [patientList, setPatientList] = useState<PatientMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const fetchPatients = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:5000/api/patients',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPatientList(response.data);

    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patientList.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patientList, searchTerm]);

  const columns: GridColDef[] = [

    {
      field: 'name',
      headerName: 'Patient Name',
      flex: 2,
      minWidth: 260,

      renderCell: (params) => (

        <div className="user-info-cell">

          {params.row.avatar ? (
            <img
              src={params.row.avatar}
              alt={params.row.name}
              className="user-avatar-img"
            />
          ) : (
            <div className="user-avatar">
              {params.row.name?.charAt(0) || 'P'}
            </div>
          )}

          <div className="user-meta">
            <p className="user-name">{params.row.name}</p>
            <p className="user-id">
              ID: {params.row.id.slice(-6).toUpperCase()}
            </p>
          </div>

        </div>
      )
    },

    {
      field: 'bloodType',
      headerName: 'Blood Group',
      width: 140,

      renderCell: (params) => (
        <div className="blood-block-v">
          <span className="blood-badge-v">
            {params.row.bloodType || 'N/A'}
          </span>
        </div>
      )
    },

    {
      field: 'vitals',
      headerName: 'Vitals / Info',
      flex: 1.6,
      minWidth: 200,

      renderCell: (params) => (

        <div className="vitals-container">

          <span className={`status-vitals ${params.row.vitals?.color || 'normal'}`}>
            {params.row.vitals?.status || 'Normal'}
          </span>

          <span className="vitals-type">
            {params.row.vitals?.type_info || 'Routine'}
          </span>

        </div>
      )
    },

    {
      field: 'contact',
      headerName: 'Contact Info',
      flex: 2,
      minWidth: 240,

      renderCell: (params) => (

        <div className="contact-cell">

          <div className="contact-item">
            <Mail size={14} />
            <span>{params.row.email}</span>
          </div>

          {params.row.phone && (
            <div className="contact-item">
              <Phone size={14} />
              <span>{params.row.phone}</span>
            </div>
          )}

        </div>
      )
    },

    {
      field: 'lastVisit',
      headerName: 'Last Visit',
      width: 180,

      renderCell: (params) => (

        <div className="status-tag active">

          <Calendar size={14} />

          <span>
            {params.value
              ? new Date(params.value as string)
                  .toLocaleDateString('en-GB')
              : 'No Records'}
          </span>

        </div>
      )
    },

    {
      field: 'actions',
      headerName: '',
      sortable: false,
      width: 80,

      renderCell: () => (
        <div className="action-wrapper">
          <button className="action-dot-btn">
            <MoreVertical size={18} />
          </button>
        </div>
      )
    }
  ];

  return (

    <div className="patient-page-container">

      <div className="page-header">

        <div className="header-titles">
          <h1>Patient Records</h1>
          <p>Real-time clinical patient directory and history.</p>
        </div>

        <div className="header-actions">

          <button className="btn-secondary">
            <Download size={18} /> Export
          </button>

          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus size={18} /> Register Patient
          </button>

        </div>
      </div>

      <div className="table-controls">

        <div className="search-wrapper">

          <Search size={20} className="search-icon" />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        <button className="filter-btn">
          <Filter size={18} /> Filter
        </button>

      </div>

      <div className="table-section-card">

        {loading ? (

          <div className="skeleton-container">
            <HMSSkeleton variant="rounded" height={90} count={6} />
          </div>

        ) : (

          <>

            <HMSTable
              rows={filteredPatients}
              columns={columns}
              checkboxSelection
              rowHeight={95}
              sx={{

                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 12px',
                  whiteSpace: 'normal',
                  overflow: 'visible'
                },

                '& .MuiDataGrid-columnHeaders': {
                  fontWeight: 600
                },

                '& .MuiDataGrid-footerContainer': {
                  display: 'none'
                }

              }}
            />

            <div className="pagination-footer">

              <HMSPagination
                count={Math.ceil(filteredPatients.length / pageSize)}
                page={page}
                onChange={(_, val) => setPage(val)}
              />

            </div>

          </>
        )}

      </div>

      <RegisterPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPatients}
      />

    </div>
  );
};

export default PatientList;