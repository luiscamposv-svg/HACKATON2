import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ProjectsPage from './pages/Projects';
import TasksPage from './pages/Tasks';
import ProfilePage from './pages/Profile';
import TeamPage from './pages/Team';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/common/AppLayout';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
