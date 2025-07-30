import React from 'react';
import {AuthProvider} from './contexts/authContext/AuthContext';
import {CartProvider} from './contexts/cartContext/CartContext';
import Login from './components/auth/login';
import ForgotPassword from './components/auth/forgot-password';
import Signup from './components/auth/signup';
import Home from './pages/home';
import Recursos from './pages/recursos';
import RecursoDetalle from './pages/recursoDetalle';
import CursoDetalle from './pages/cursoDetalle';
import Checkout from './pages/checkout';
import CrearCita from './pages/crearCita'
import MisCitas from './pages/misCitas';
import MisCursos from './pages/misCursos';
import MisRecursos from './pages/misRecursos';
import Perfil from './pages/perfil';
import Servicios from './pages/services.js';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/recursos" element={<Recursos />} />
                        <Route path="/recurso/:id" element={<RecursoDetalle />} />
                        <Route path="/curso/:id" element={<CursoDetalle />} />
                        <Route path="/servicio/:id" element={<Servicios />} />
                        <Route path="/crear-cita" element={<CrearCita />} />
                        <Route path="/mis-citas" element={<MisCitas />} />
                        <Route path="/mis-cursos" element={<MisCursos />} />
                        <Route path="/mis-recursos" element={<MisRecursos />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/" element={<Navigate to="/home" />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
