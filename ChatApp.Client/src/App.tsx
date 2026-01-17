import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Chat from './components/Chat';
import Login from './components/login';
import AuthCallback from './components/AuthCallback';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="login-container"><div className="login-box">Loading...</div></div>;
  }
  
  return user ? children : <Navigate to="/login" />;

}

function PublicRoute({ children }: { children: React.ReactNode}) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<PrivateRoute><Chat /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;