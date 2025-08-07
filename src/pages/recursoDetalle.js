import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { getRecursos } from '../services/recursosService';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/recursoDetalle.css";
import CircularProgress from '@mui/material/CircularProgress';
import InfoModal from '../components/ui/InfoModal';
import { useCart } from '../contexts/cartContext/CartContext';
import { AuthContext } from '../contexts/authContext/AuthContext';

export default function RecursoDetalle() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [recurso, setRecurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModalAdquirir, setShowModalAdquirir] = useState(false);
  const [showModalCarrito, setShowModalCarrito] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getRecursos().then(data => {
      const found = data.find(r => r.id === id);
      setRecurso(found);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
      AOS.init({ duration: 1000, once: false });
    }, []);

  const descargarPDF = () => {
    if (!recurso || !recurso.archivoDriveId) return;
    const url = `https://drive.google.com/uc?export=download&id=${recurso.archivoDriveId}`;
    window.open(url, '_blank');
  }
  
  if (loading) return <div className="home-container"><Header /><div style={{textAlign:'center', display: 'center',marginTop:64}}><CircularProgress /><p>Cargando...</p></div></div>;
  
  if (!recurso) return <div className="home-container"><Header /><div style={{textAlign:'center',marginTop:64}}>Recurso no encontrado</div></div>;

  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="recurso-detalle-section">
        <div className="recurso-detalle-card">
          <img src={recurso.imagenFutura || "/baner.png"} alt={recurso.nombre} />
          <h2>{recurso.nombre}</h2>
          <p>{recurso.descripcionLarga}</p>
          {typeof recurso.costo === 'number' && (
            <div className="book-cost">
              {recurso.costo > 0 ? `$${recurso.costo}` : 'Gratis'}
            </div>
          )}
          <button
            className="btn primary"
            onClick={() => {
              if (recurso.costo === 0) {
                descargarPDF();
              } 
              if (!user && recurso.costo !== 0) {
                localStorage.setItem("pendingCartItem", JSON.stringify(recurso));
                setShowModalAdquirir(true);
                setTimeout(() => {
                  navigate('/login', { state: { redirectTo: '/checkout' } });
                }, 2500);
              } else if(recurso.costo !== 0){
                addToCart(recurso);
                navigate('/checkout');
              }
            }}
          >
            Adquirir
          </button>
          {recurso.costo !== 0 && 
            <button
              className="btn outline"
              style={{marginTop: 12}}
              onClick={() => {
              if (!user) {
                localStorage.setItem("pendingCartItem", JSON.stringify(recurso));
                setShowModalCarrito(true);
                setTimeout(() => {
                  navigate('/login', { state: { redirectTo: `/recurso/${recurso.id}` } });
                }, 2500);
              } else{
                addToCart(recurso);
              }
              }}
            >
              Agregar al carrito
            </button>
          }
        
        </div>
        
      </section>
      
      <InfoModal
        open={showModalAdquirir}
        title="Debes iniciar sesión para poder comenzar a agregar artitulos al carrito."
        message="Redirigiendo..."
      />
      <InfoModal
        open={showModalCarrito}
        title="Debes iniciar sesión para poder inscribirte a este curso."
        message="Redirigiendo..."
      />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
