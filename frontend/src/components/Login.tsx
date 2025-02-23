import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { login, storeToken } from '../services/authServices';
import { useNavigate } from 'react-router-dom'; 

import MyButton from './all/Button';

interface LoginResponse {
  status: string;
  message: string;
  token: string;
}

const Login: React.FC = () => {
  // State for storing input values
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginData = {
      username,
      password,
    };

    try {
        const response = await login(loginData);
        if (response?.status === 'success') {
            storeToken(response.token)
            toast.success(response.message);
            
            navigate('/home')
        } 
        else 
            toast.error(response?.message || 'Invalid login credentials');
    } catch (error) {
      toast.error('An error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <MyButton label={'Login'} />
      </form>
    </div>
  );
};

export default Login;
