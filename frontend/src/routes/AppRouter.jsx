import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import UserDashboardPage from '../pages/user/UserDashboardPage';
import OperatorDashboardPage from '../pages/operator/OperatorDashboardPage';
import OperatorAnomalyPage from '../pages/operator/OperatorAnomalyPage';
import OperatorVehiclePage from '../pages/operator/OperatorVehiclePage';
import OperatorInfraServicePage from '../pages/operator/OperatorInfraServicePage';
import ProtectedRoute from './ProtectedRoute';
import { getStoredSession } from '../utils/authStorage';

function LoginRoute() {
  const session = getStoredSession();

  if (!session) {
    return <LoginPage />;
  }

  return (
    <Navigate
      to={session.role === 'operator' ? '/operator/infra-service' : '/user/dashboard'}
      replace
    />
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/anomaly"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorAnomalyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/vehicle"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorVehiclePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/infra-service"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorInfraServicePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default AppRouter;
