import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateActivity from './pages/CreateActivity';
import ActivityDetails from './pages/ActivityDetails';
import EditActivity from './pages/EditActivity';
import Profile from './pages/Profile';

function AppContent() {
  const location = useLocation();
  const hideHeaderPaths = ['/home', '/register', '/login'];
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-activity" element={<CreateActivity />} />
        <Route path="/activities/:id" element={<ActivityDetails />} />
        <Route path="/activities/:id/edit" element={<EditActivity />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
