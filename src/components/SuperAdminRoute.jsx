import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Guards routes that only a super_admin may see (Admins, Rules). A legacy
// admin created before adminRole existed (adminRole === null/undefined) is
// treated as super_admin, matching the backend's superAdminOnly middleware.
const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  const isSuperAdmin = user && (user.adminRole === 'super_admin' || !user.adminRole);
  if (!isSuperAdmin) return <Navigate to="/" replace />;
  return children;
};

export default SuperAdminRoute;
