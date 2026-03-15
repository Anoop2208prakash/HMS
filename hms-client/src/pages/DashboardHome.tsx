import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, Calendar, Activity, ClipboardList, 
  Pill, HeartPulse, TrendingUp, ArrowRight,
  FileText, Heart
} from 'lucide-react';
import type { GridColDef } from '@mui/x-data-grid';
import HMSTable from '../components/common/HMSTable';
import HMSSkeleton from '../components/common/HMSSkeleton';
import '../styles/pages/Dashboard.scss';

// --- Interfaces ---
interface UserProfile {
  name: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'STAFF';
  avatar?: string;
}

interface AppointmentData {
  id: string;
  patient: string; // Doctor name for patients, Patient name for staff
  time: string;
  status: string;
}

interface DashboardData {
  stats: Array<{ label: string; value: string; color: string; }>;
  appointments: AppointmentData[];
}

const DashboardHome = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🚀 FIXED: Lazy Initializer for State (No more cascading render error)
  const [user] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch (err) {
      console.error("Failed to parse user data", err);
      return null;
    }
  });

  const isPatient = user?.role === 'PATIENT';

  // 🚀 Fetch Dashboard Data from Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 🚀 Map backend labels to specific Lucide icons
  const iconMap: Record<string, JSX.Element> = {
    'Total Patients': <Users size={24} />,
    'Appointments': <Calendar size={24} />,
    'Active Doctors': <Activity size={24} />,
    'New Reports': <ClipboardList size={24} />,
    'Next Visit': <Calendar size={24} />,
    'Active Meds': <Pill size={24} />,
    'Lab Reports': <FileText size={24} />,
    'Health Score': <HeartPulse size={24} />
  };

  const appointmentColumns: GridColDef[] = useMemo(() => [
    { field: 'patient', headerName: isPatient ? 'Doctor' : 'Patient', flex: 1 },
    { field: 'time', headerName: 'Time', width: 120 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 140, 
      renderCell: (params) => (
        <span className={`status-tag ${params.value.toString().toLowerCase()}`}>
          {params.value}
        </span>
      ) 
    }
  ], [isPatient]);

  return (
    <div className={`dashboard-container ${isPatient ? 'patient-view' : 'admin-view'}`}>
      
      {/* Welcome Header */}
      <div className="welcome-section">
        <div className="text">
          <h1>Hello, {isPatient ? user?.name?.split(' ')[0] : `Dr. ${user?.name}`}</h1>
          <p>
            {isPatient 
              ? "Your health journey is looking great! Here are your updates." 
              : "Here's a summary of your hospital's performance today."}
          </p>
        </div>
        {isPatient && (
          <button className="btn-primary">Book Appointment <ArrowRight size={18} /></button>
        )}
      </div>

      {/* Stats Cards Section */}
      <div className="stats-grid">
        {loading ? (
          <HMSSkeleton variant="rounded" height={120} count={4} />
        ) : (
          data?.stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className={`icon-box ${stat.color}`}>
                {iconMap[stat.label] || <Activity size={24} />}
              </div>
              <div className="info">
                <span>{stat.label}</span>
                <h3>{stat.value}</h3>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Content Layout */}
      <div className="dashboard-main-layout">
        <div className="main-feed">
          
          {/* Schedule/Appointments Table */}
          <div className="recent-section">
            <div className="section-header">
              <h2>{isPatient ? 'My Schedule' : 'Upcoming Appointments'}</h2>
              <button className="view-all-btn">View All</button>
            </div>
            
            {loading ? (
              <HMSSkeleton variant="rounded" height={300} count={1} />
            ) : (
              <HMSTable 
                rows={data?.appointments || []} 
                columns={appointmentColumns} 
                rowHeight={80}
                sx={{
                  '& .MuiDataGrid-footerContainer': { display: 'none' },
                  border: 'none'
                }}
              />
            )}
          </div>

          {/* Patient-Only Health Insights */}
          {isPatient && (
            <div className="insights-section">
              <div className="section-header">
                <h2>Health Insights</h2>
              </div>
              <div className="insights-grid">
                <div className="insight-card-item">
                  <div className="insight-icon green"><TrendingUp size={20} /></div>
                  <div className="insight-text">
                    <h4>Blood Pressure Stable</h4>
                    <p>Your readings stayed within range for 14 days.</p>
                  </div>
                </div>
                <div className="insight-card-item">
                  <div className="insight-icon blue"><Activity size={20} /></div>
                  <div className="insight-text">
                    <h4>Activity Level Up</h4>
                    <p>You’ve averaged 8,500 steps this week.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="side-bar">
          <div className="tip-card">
            <div className="tip-icon"><Heart size={24} fill="white" color="white" /></div>
            <h4>Health Tip of the Day</h4>
            <p>Drinking 8 glasses of water daily improves skin health and digestion.</p>
            <button className="tip-action">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;