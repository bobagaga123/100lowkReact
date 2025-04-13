import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HeadmanPanel from './pages/HeadmanPanel';
import AdminPanel from './pages/AdminPanel';
import Header from './components/Header';

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children, requiredRoles }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!role) {
    return <Navigate to="/login" />;
  }

  // Проверяем, есть ли роль пользователя в списке разрешенных ролей
  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requiredRoles={['student', 'group_head', 'cafe_admin']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/headman" 
            element={
              <ProtectedRoute requiredRoles={['group_head']}>
                <HeadmanPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRoles={['cafe_admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
