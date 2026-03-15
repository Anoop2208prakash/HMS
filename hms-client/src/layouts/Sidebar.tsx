import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Pill, 
  FileText, 
  Settings, 
  LogOut,
  Heart,
  ShieldUser 
} from 'lucide-react';
import '../styles/layouts/Sidebar.scss';

// 🚀 Added explicit Interface for Type Safety
interface UserProfile {
  name: string;
  avatar?: string;
  role: string;
}

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Sidebar user fetch failed", error);
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={22} /> },
    { path: '/dashboard/staff', label: 'Staff Management', icon: <ShieldUser size={22} /> },
    { path: '/dashboard/patients', label: 'Patients', icon: <Users size={22} /> },
    { path: '/dashboard/doctors', label: 'Doctors', icon: <Stethoscope size={22} /> },
    { path: '/dashboard/appointments', label: 'Appointments', icon: <Calendar size={22} /> },
    { path: '/dashboard/pharmacy', label: 'Pharmacy', icon: <Pill size={22} /> },
    { path: '/dashboard/reports', label: 'Medical Reports', icon: <FileText size={22} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside className="hms-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Heart size={24} fill="white" color="white" />
        </div>
        <h1 className="brand-name">MDL<span>Labs</span></h1>
      </div>

      <nav className="sidebar-menu">
        <p className="menu-label">Main Menu</p>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
                end={item.path === '/dashboard'}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="menu-label secondary">System</p>
        <ul className="menu-list">
          <li>
            <NavLink to="/dashboard/settings" className="menu-item">
              <span className="icon"><Settings size={22} /></span>
              <span className="label">Settings</span>
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="menu-item logout-btn">
              <span className="icon"><LogOut size={22} /></span>
              <span className="label">Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="avatar-wrapper">
            {user?.avatar ? (
              <img src={user.avatar} alt="user" className="avatar-img" />
            ) : (
              <div className="avatar-fallback">{user?.name?.charAt(0) || 'U'}</div>
            )}
            <span className="online-status"></span>
          </div>
          <div className="details">
            <p className="name">{user?.name || 'Loading...'}</p>
            <p className="role">{user?.role?.toLowerCase() || 'Verified'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;