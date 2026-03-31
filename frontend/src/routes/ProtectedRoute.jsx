import { Navigate } from 'react-router-dom';
import { getStoredSession } from '../utils/authStorage';

function ProtectedRoute({ allowedRoles, children }) {
  const session = getStoredSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(session.role)) {
    const fallbackPath =
      session.role === 'operator'
        ? '/operator/infra-service'
        : '/user/dashboard';

    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
