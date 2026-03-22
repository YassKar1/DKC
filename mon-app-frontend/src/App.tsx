import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventglowTemplate from './pages/EventglowTemplate';
import EventglowIndex from './eventglow/pages/Index';
import EventglowDetail from './eventglow/pages/EventDetail';
import EventglowRegister from './eventglow/pages/EventRegistration';
import EventglowCreate from './eventglow/pages/CreateEvent';
import EventglowNotFound from './eventglow/pages/NotFound';
import Profile from './pages/Profile';
import Reservations from './pages/Reservations';
import { ProtectedRoute } from './components/ProtectedRoute';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/template" element={<EventglowTemplate />} />
        <Route path="/events" element={<EventglowIndex />} />
        <Route path="/events/create" element={<EventglowCreate />} />
        <Route path="/events/:id" element={<EventglowDetail />} />
        <Route path="/events/:id/register" element={<EventglowRegister />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          }
        />
        
        {/* Route protégée */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<EventglowNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

