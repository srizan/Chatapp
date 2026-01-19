import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem('chatapp_token', token);
      login(token).then(() => {
        navigate('/');
      });
    } else {
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="login-container">
        <div className="login-box">
      
        <h2>Authenticating...</h2>
        </div>
    </div>
      
    
  );
}

export default AuthCallback;