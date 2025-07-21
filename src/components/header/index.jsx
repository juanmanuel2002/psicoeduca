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
        <div className="logo">
          <img src="/baner.png" alt="Logo Psicoeduca" className="logo-image" />
          <div className="logo-text">Psicoeduca</div>
        </div>
        <div className="header-actions">
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
      <nav data-aos="fade-up" className={`nav-bar ${open ? "open" : ""}`}>
        <div className="nav-bar-inner">
          <a href="#services" onClick={() => setOpen(false)}>Servicios</a>
          <a href="#books" onClick={() => setOpen(false)}>Manuales y Libros</a>
          <a href="#english" onClick={() => setOpen(false)}>Clases de Inglés</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contacto</a>
          <div className="header-btns-mobile">
            <button onClick={() => navigate('/login')} className="header-btn">Inicia sesión</button>
            <button onClick={() => navigate('/signup')} className="header-btn">Regístrate</button>
          </div>
        </div>
        {open && (
          <>
            {/*<button className="menu-close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
              <CloseIcon fontSize="large" />
            </button>*/}
            <div className="nav-backdrop" onClick={() => setOpen(false)} />
          </>
        )}
      </nav>
    </>
  );
}
