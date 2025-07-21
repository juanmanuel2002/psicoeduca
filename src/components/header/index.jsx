
import React, { useState } from "react";
import "./header.css";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="logo">
        <img src="/baner.png" alt="Logo Psicoeduca" className="logo-image" />
        <div className="logo-text">Psicoeduca</div>
      </div>
      <nav className={`nav ${open ? "open" : ""}`}>
        {open && (
          <button className="menu-close" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="large" />
          </button>
        )}
        <a href="#services" onClick={() => setOpen(false)}>Servicios</a>
        <a href="#books" onClick={() => setOpen(false)}>Manuales y Libros</a>
        <a href="#english" onClick={() => setOpen(false)}>Clases de Inglés</a>
        <a href="#contact" onClick={() => setOpen(false)}>Contacto</a>
      </nav>
      <button className="menu-toggle" aria-label="Abrir menú" onClick={() => setOpen(!open)} style={{display: open ? 'none' : undefined}}>
        <span className="menu-icon">
          <MenuIcon fontSize="large" />
        </span>
      </button>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}
