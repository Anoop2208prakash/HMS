import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./features/auth/Login";
import DashboardHome from "./pages/DashboardHome";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    // Fix: Wrap the Layout inside ProtectedRoute so it passes MainLayout as 'children'
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
      // You can easily add more pages here later
      // { path: "patients", element: <PatientsList /> }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);