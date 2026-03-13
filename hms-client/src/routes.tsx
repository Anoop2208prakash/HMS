import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./features/auth/Login";
import DashboardHome from "./pages/DashboardHome";
import StaffList from "./pages/admin/StaffList"; // 1. Import your new Staff List page
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
        index: true, // This is /dashboard
        element: <DashboardHome />,
      },
      {
        path: "staff", // This is /dashboard/staff
        element: <StaffList />,
      },
      {
        path: "patients", // Placeholder for next step
        element: <div style={{ padding: '20px' }}><h2>Patients Module (Coming Soon)</h2></div>,
      },
      {
        path: "appointments",
        element: <div style={{ padding: '20px' }}><h2>Appointments Module (Coming Soon)</h2></div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);