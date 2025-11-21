import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { isAdminSessionValid, clearAdminSession } from '../../utils/adminSession';

// TEMPORARY: Admin security disabled - set to true to enable security
const ADMIN_SECURITY_ENABLED = false;

const ProtectedAdminRoute = ({ children }) => {
  const { loading } = useAuth();
  const location = useLocation();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    // TEMPORARY: Bypass authentication if security is disabled
    if (!ADMIN_SECURITY_ENABLED) {
      setAdminAuthenticated(true);
      setCheckingAdmin(false);
      return;
    }

    const checkAdminAuth = async () => {
      // Wait for auth context to finish loading
      if (loading) {
        return;
      }

      // Check if admin session is valid
      if (!isAdminSessionValid()) {
        setAdminAuthenticated(false);
        setCheckingAdmin(false);
        return;
      }

      // TODO: Verify admin token with backend
      // For now, if session is valid locally, consider authenticated
      // In production, make API call to verify token validity
      try {
        // const { api } = await import('../../services/api');
        // await api.admin.verifySession();
        setAdminAuthenticated(true);
      } catch (error) {
        // Token invalid, clear it
        clearAdminSession();
        setAdminAuthenticated(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminAuth();
  }, [loading]);

  // TEMPORARY: If security is disabled, immediately render children
  if (!ADMIN_SECURITY_ENABLED) {
    return children;
  }

  // Show loading state
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated (only if security is enabled)
  if (ADMIN_SECURITY_ENABLED && !adminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // TODO: Add role-based access control
  // Check if user has admin role (if user object includes role)
  // if (user && user.role !== 'admin' && user.role !== 'super_admin') {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedAdminRoute;
