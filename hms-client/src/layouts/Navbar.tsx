import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import '../styles/layouts/Navbar.scss';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="hms-navbar">
      <div className="navbar-left">
        <h2 className="current-page-title">Overview</h2>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="navbar-actions">
          <button className="action-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
        </div>

        {/* PROFILE SECTION WITH DROPDOWN */}
        <div className="profile-container" ref={dropdownRef}>
          <div 
            className={`user-profile-trigger ${showDropdown ? 'active' : ''}`} 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-info">
              <p className="user-name">Anoop Prakash</p>
              <p className="user-role">Administrator</p>
            </div>
            <div className="avatar-wrapper">
              <div className="avatar">
                <User size={20} />
              </div>
              <ChevronDown size={14} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
            </div>
          </div>

          {/* DROPDOWN MENU */}
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p>Manage Account</p>
              </div>
              <button className="dropdown-item" onClick={() => navigate('/dashboard/profile')}>
                <User size={16} />
                <span>My Profile</span>
              </button>
              <button className="dropdown-item" onClick={() => navigate('/dashboard/settings')}>
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={handleSignOut}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;