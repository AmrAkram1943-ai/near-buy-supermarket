import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const supermarket = localStorage.getItem("supermarket");

  if (!supermarket) {
    return <Navigate to="/login" replace />;
  }

  return children;
}