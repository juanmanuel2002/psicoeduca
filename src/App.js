import React from 'react';
import Login from './components/auth/login';
import ForgotPassword from './components/auth/forgot-password';
import Signup from './components/auth/signup';
import Home from './pages/home';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

const App = () => {
    return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
            </Router>
    );
};

export default App;
