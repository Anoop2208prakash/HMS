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
  ShieldUser // Icon for Staff
} from 'lucide-react';
import '../styles/layouts/Sidebar.scss';

const Sidebar = () => {
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);
  const navigate = useNavigate();

  // Fetch user data for the mini-card
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
    { path: '/dashboard/staff', label: 'Staff Management', icon: <ShieldUser size={22} /> }, // Added Staff link
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
          <Heart size={24} fill="white" />
        </div>
        <h1 className="brand-name">HMS<span>Pro</span></h1>
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
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="user" className="avatar-img" />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="details">
            <p className="name">{user?.name || 'Loading...'}</p>
            <div className="status-indicator">
              <span className="dot"></span>
              <p className="status">Online</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;