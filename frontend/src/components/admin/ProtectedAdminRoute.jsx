import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { isAdminSessionValid, setupAdminActivityTracking, setupSessionExpirationWarning, clearAdminSession } from '../../utils/adminSession';
import toast from 'react-hot-toast';

const ProtectedAdminRoute = ({ children }) => {
  const { loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
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

    if (!loading) {
      checkAdminAuth();
    }
  }, [loading]);

  // Setup activity tracking
  useEffect(() => {
    if (adminAuthenticated) {
      const cleanup = setupAdminActivityTracking();
      return cleanup;
    }
  }, [adminAuthenticated]);

  // Setup session expiration warning
  useEffect(() => {
    if (adminAuthenticated) {
      const cleanup = setupSessionExpirationWarning(
        (minutesRemaining) => {
          toast.error(`Your admin session will expire in ${minutesRemaining} minutes. Please save your work.`, {
            duration: 10000,
          });
        },
        () => {
          clearAdminSession();
          toast.error('Your admin session has expired. Please log in again.');
          navigate('/admin/login', { state: { from: location }, replace: true });
        }
      );
      return cleanup;
    }
  }, [adminAuthenticated, navigate, location]);

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

  // Redirect to admin login if not authenticated
  if (!adminAuthenticated) {
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
