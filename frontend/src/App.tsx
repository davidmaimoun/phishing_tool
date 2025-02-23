import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { decodeToken, fetchToken } from "./services/authServices";
import { User } from "./types/types";
import Logout from "./components/Logout";
import { UserProvider } from "./context/UserContext";

const App: React.FC = () => {
  const [user, setUser] = useState<User|null>(null)

  useEffect(() => {
    const authToken: string | null = fetchToken()
    if (authToken) {
      const {username}  = decodeToken(authToken);
      
      setUser({username})
      
    } else {
      console.log('No auth token found');
    }
  }, [])


  return (
    <UserProvider>
      <div className="app-container">
          <Router>
          <ToastContainer aria-label={undefined}/>
      
          <Header user={user}/>
                
          <div className="main-content">
            <aside className="left-side">
            </aside>
            
            <main className="main">
                <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/" element={<Home />} />
                </Routes>
            </main>
            
            <aside className="right-side">
            </aside>
          </div>

          </Router>
      
    
      </div>

    </UserProvider>

  );
};

export default App;
