import React, { useState, useEffect, useContext } from "react";
import { useCart } from '../../contexts/cartContext/CartContext';
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
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cart, removeFromCart, clearCart } = useCart();

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
              {/*<button onClick={() => navigate('/signup')} className="header-btn">Regístrate</button>*/}
            </div>
          ) : (
            <button className="header-btn account-btn" aria-label="Cuenta" onClick={() => setSidebarOpen(true)}>
              <AccountCircleIcon fontSize="large" />
            </button>
          )}
          <button className="header-btn cart-btn" aria-label="Carrito" onClick={() => setCartOpen(true)}>
            <ShoppingCartIcon fontSize="medium" />
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
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
          <a href="#conocenos" onClick={() => { navigate('/home'); setOpen(false); }}>Conocenos</a>
          <a href="#services" onClick={() => { navigate('/home'); setOpen(false); }}>Servicios</a>

          <a onClick={() => { navigate('/cursos'); setOpen(false); }}>Cursos</a>
          <a onClick={() => { navigate('/recursos'); setOpen(false); }}>Recursos Psicológicos</a>

          <a href="#english" onClick={() => { navigate('/english'); setOpen(false); }}>Clases de Inglés</a>
          <a href="#comunidad" onClick={() => { navigate('/home'); setOpen(false); }}>Comunidad</a>
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
              <button className="account-sidebar-btn" onClick={() => { navigate('/mis-recursos'); setSidebarOpen(false); }}>Mis Recursos</button>
              <button className="account-sidebar-btn" onClick={() => { navigate('/mis-citas'); setSidebarOpen(false); }}>Mis Citas</button>
              <button className="account-sidebar-btn logout" onClick={() => { logout(); setSidebarOpen(false); navigate('/')}}>Cerrar sesión</button>
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar del carrito */}
      {cartOpen && (
        <div className="cart-sidebar-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-sidebar-header">
              <h3>Mi Carrito</h3>
              <button className="close-btn" onClick={() => setCartOpen(false)}>×</button>
            </div>
            {cart.length === 0 ? (
              <p className="empty-cart-text">Tu carrito está vacío</p>
            ) : (
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={index} className="cart-item" style={{display:'flex', alignItems:'center', marginBottom:16, borderBottom:'1px solid #eee', paddingBottom:8, position:'relative'}}>
                    <img src={item.imagenFutura || '/baner.png'} alt={item.nombre} style={{width:48, height:48, objectFit:'cover', borderRadius:8, marginRight:12}} />
                    <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center'}}>
                      <div style={{fontWeight:'bold', fontSize:15}}>{item.nombre}</div>
                      <button 
                        className="remove-btn"
                        style={{fontSize:11, color:'#e74c3c', background:'none', border:'none', marginTop:4, alignSelf:'flex-start', cursor:'pointer', padding:0}}
                        onClick={() => removeFromCart(item.id)}
                      >Eliminar</button>
                    </div>
                    <div style={{fontWeight:'bold', fontSize:15, marginLeft:8, minWidth:60, textAlign:'right'}}>
                      {item.costo > 0 ? `$${item.costo}` : 'Gratis'}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Subtotal y total */}
            {cart.length > 0 && (
              <div className="cart-sidebar-footer" style={{borderTop:'1px solid #eee', paddingTop:12, marginTop:8}}>
                <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:15, marginBottom:4}}>
                  <span>Subtotal:</span>
                  <span>{`$${cart.reduce((acc, item) => acc + (item.costo > 0 ? item.costo : 0), 0)}`}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:17, marginBottom:12}}>
                  <span>Total:</span>
                  <span>{`$${cart.reduce((acc, item) => acc + (item.costo > 0 ? item.costo : 0), 0)}`}</span>
                </div>
                <button className="clear-cart-btn" onClick={clearCart}>Vaciar carrito</button>
                <button className="checkout-btn" onClick={() => { navigate('/checkout'); setCartOpen(false); }}>Ir a pagar</button>
              </div>
            )}
          </aside>
        </div>
      )}

    </>
  );
}
