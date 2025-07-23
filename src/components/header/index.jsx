import React, { useState, useEffect } from "react";
import "./header.css";
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AOS from 'aos';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <>
      {/* Barra superior */}
      <header className="header header-top">
        <div data-aos="fade-up" className="logo">
          <img src="/baner.png" alt="Logo Psicoeduca" className="logo-image" />
          <div className="logo-text">Psicoeduca</div>
        </div>
        <div data-aos="fade-up" className="header-actions">
          <div className="header-btns-desktop">
            <button onClick={() => navigate('/login')} className="header-btn">Inicia sesión</button>
            <button onClick={() => navigate('/signup')} className="header-btn">Regístrate</button>
          </div>
          <button className="header-btn cart-btn" aria-label="Carrito">
            <ShoppingCartIcon fontSize="medium" />
          </button>
          <button className="menu-toggle" aria-label="Abrir menú" onClick={() => setOpen(!open)}>
            <span className="menu-icon">
              <MenuIcon fontSize="large" />
            </span>
          </button>
        </div>
      </header>

      {/* Barra de navegación */}
      <nav className={`nav-bar ${open ? "open" : ""}`}>
        <div data-aos="fade-up" className="nav-bar-inner">
          <a href="#services" onClick={() => {navigate('/home');setOpen(false)}}>Servicios</a>
          <a href="#cursos" onClick={() => {navigate('/home');setOpen(false)}}>Cursos</a>
          <a href="#books" onClick={() => {navigate('/home');setOpen(false)}}>Recursos</a>
          <a href="#english" onClick={() => {navigate('/home');setOpen(false)}}>Clases de Inglés</a>
          <a href="#contact" onClick={() => {navigate('/home');setOpen(false)}}>Contacto</a>
          <div className="header-btns-mobile">
            <button onClick={() => navigate('/login')} className="header-btn">Inicia sesión</button>
            <button onClick={() => navigate('/signup')} className="header-btn">Regístrate</button>
          </div>
        </div>
        {open && (
          <>
            <div className="nav-backdrop" onClick={() => setOpen(false)} />
          </>
        )}
      </nav>
    </>
  );
}
