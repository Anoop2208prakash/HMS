import React from 'react';
import { Users, Calendar, Activity, ClipboardList } from 'lucide-react';
import '../styles/pages/Dashboard.scss';

const DashboardHome = () => {
  const stats = [
    { label: 'Total Patients', value: '1,284', icon: <Users size={24} />, color: 'blue' },
    { label: 'Appointments', value: '42', icon: <Calendar size={24} />, color: 'purple' },
    { label: 'Active Doctors', value: '18', icon: <Activity size={24} />, color: 'green' },
    { label: 'New Reports', value: '12', icon: <ClipboardList size={24} />, color: 'orange' },
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Hello, Dr. Anoop Prakash</h1>
        <p>Here's what's happening in your hospital today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`icon-box ${stat.color}`}>{stat.icon}</div>
            <div className="info">
              <span>{stat.label}</span>
              <h3>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Upcoming Appointments</h2>
          <button>View All</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rahul Sharma</td>
              <td>Dr. Aman Verma</td>
              <td>10:30 AM</td>
              <td><span className="status confirmed">Confirmed</span></td>
            </tr>
            <tr>
              <td>Priya Singh</td>
              <td>Dr. Sarah Khan</td>
              <td>11:15 AM</td>
              <td><span className="status pending">Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHome;