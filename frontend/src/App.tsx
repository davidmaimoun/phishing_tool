import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Home from "./components/Home";
import Header from "./components/Header";
import { useAuth } from "./contexts/UserContext";
import { useEffect } from "react";
import Login from "./components/Login";
import { getUserFromToken } from "./services/authServices";
import AppLayout from "./components/AppLayout";

const App: React.FC = () => {
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const userFetched = getUserFromToken()
    updateUser(userFetched)
    
    // toast.success(`Welcome dear ${userFetched?.username}`)
  },[])

  
  return (
    <div className="app-container">
      <ToastContainer aria-label={undefined}/>
      <Router>
        <Routes>
          {/* If no user, redirect to /login */}
          { !user ? (
            <Route path='/login' element={<Login />} />
          ) : (
            <Route path='/*' element={<AppLayout />} />
          )}

          <Route path='/' element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
      </Router>
  </div>

  );
};

export default App;


