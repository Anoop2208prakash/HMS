import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./features/auth/Login";
import DashboardHome from "./pages/DashboardHome";
import StaffList from "./pages/admin/StaffList";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientRegister from "./features/auth/PatientRegister";
import PatientList from "./pages/admin/PatientList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    // 🚀 Public route for new patients to sign up
    path: "/register",
    element: <PatientRegister />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, 
        element: <DashboardHome />,
      },
      {
        path: "staff", 
        element: <StaffList />,
      },
      {
        path: "patients", 
        // 🚀 You can eventually replace this div with a <PatientList /> component
        element: <PatientList />,
      },
      {
        path: "appointments",
        element: <div style={{ padding: '20px' }}><h2>Appointments & Scheduling</h2></div>,
      },
      {
        path: "profile",
        element: <div style={{ padding: '20px' }}><h2>My Profile Settings</h2></div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);