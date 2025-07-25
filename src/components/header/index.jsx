import React, { useState, useEffect, useContext } from "react";
import "./header.css";
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AOS from 'aos';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext/AuthContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <>
      {/* Barra superior */}
      <header className="header header-top">
        <div data-aos="fade-up" className="logo" onClick={() => navigate('/home')}>
          <img src="/baner.png" alt="Logo Psicoeduca" className="logo-image" />
          <div className="logo-text">Psicoeduca</div>
        </div>
        <div data-aos="fade-up" className="header-actions">
          {!user ? (
            <div className="header-btns-desktop">
              <button onClick={() => navigate('/login')} className="header-btn">Inicia sesión</button>
              <button onClick={() => navigate('/signup')} className="header-btn">Regístrate</button>
            </div>
          ) : (
            <button className="header-btn account-btn" aria-label="Cuenta" onClick={() => setSidebarOpen(true)}>
              <AccountCircleIcon fontSize="large" />
            </button>
          )}
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
          <a href="#services" onClick={() => { navigate('/home'); setOpen(false); }}>Servicios</a>
          <a href="#cursos" onClick={() => { navigate('/home'); setOpen(false); }}>Cursos</a>
          <a href="#books" onClick={() => { navigate('/home'); setOpen(false); }}>Recursos</a>
          <a href="#english" onClick={() => { navigate('/home'); setOpen(false); }}>Clases de Inglés</a>
          <a href="#contact" onClick={() => { navigate('/home'); setOpen(false); }}>Contacto</a>
          {!user ? (
            <div className="header-btns-mobile">
              <button onClick={() => navigate('/login')} className="header-btn">Inicia sesión</button>
              <button onClick={() => navigate('/signup')} className="header-btn">Regístrate</button>
            </div>
          ) : null}
        </div>
        {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
      </nav>

      {/* Sidebar de usuario (fuera del nav) */}
      {sidebarOpen && (
        <div className="account-sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <aside className="account-sidebar" onClick={e => e.stopPropagation()}>
            <div className="account-sidebar-header">
              <AccountCircleIcon fontSize="large" style={{ marginRight: 8 }} />
              <div>
                <div className="account-user-name" title={user?.name || user?.email}>
                  {user?.name || user?.email}
                </div>
                <div className="account-user-email" title={user?.email}>
                  {user?.email}
                </div>

              </div>
            </div>
            <div className="account-sidebar-options">
              <button className="account-sidebar-btn" onClick={() => { navigate('/perfil'); setSidebarOpen(false); }}>Ver Perfil</button>
              <button className="account-sidebar-btn" onClick={() => { navigate('/mis-cursos'); setSidebarOpen(false); }}>Mis Cursos</button>
              <button className="account-sidebar-btn logout" onClick={() => { logout(); setSidebarOpen(false); }}>Cerrar sesión</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
