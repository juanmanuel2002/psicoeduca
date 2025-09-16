import React, { useEffect, useState, useContext} from "react";
import { useParams } from "react-router-dom";
import Header from "../components/header";
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { getCursos } from '../services/cursosService';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/cartContext/CartContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../styles/cursoDetalle.css";
import CircularProgress from '@mui/material/CircularProgress';
import InfoModal from '../components/ui/InfoModal';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { download } from '../services/sendEmailService';

export default function CursoDetalle() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModalAdquirir, setShowModalAdquirir] = useState(false);
  const [showModalInscribirse, setShowModalInscribirse] = useState(false);
  const [msjError, setMsjError] = useState(false);
  const [descarga, setDescarga] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getCursos().then(data => {
      const found = data.find(r => r.id === id);
      setCurso(found);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
      AOS.init({ duration: 1000, once: false });
    }, []);
  
  useEffect(() => {
    if (curso) {
      window.localStorage.setItem(
        'breadcrumbCurso',
        JSON.stringify({ id: curso.id, nombre: curso.nombre })
      );
    }
  }, [curso]);

  const descargarPDF = async () => {
      if (!curso?.id) return;
      try {
        setDescarga(true);
        const blob = await download("cursos", curso.id);
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement("a");
        a.href = url;
        a.download = `${curso.nombre || "archivo"}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setDescarga(false)
      } catch (error) {
        setDescarga(false)
        setMsjError(true); 
        setTimeout(() => {
          setMsjError(false);
        }, 4000);
        
      }
    };

  if (loading) return <div className="home-container"><Header /><div style={{textAlign:'center', display: 'center',marginTop:64}}><CircularProgress /><p>Cargando...</p></div></div>;
  
  if (!curso) return <div className="home-container"><Header /><div style={{textAlign:'center',marginTop:64}}>Curso no encontrado</div></div>;

  return (
    <div className="home-container">
      <Header />
      <section data-aos="fade-up" className="curso-detalle-section">
        <div className="curso-detalle-card">
          <img src={curso.imagenFutura || "/baner.png"} alt={curso.nombre} />
          <h2>{curso.nombre}</h2>
          <p>{curso.tipo}</p>
          <p>{curso.descripcionLarga}</p>
          {typeof curso.costo === 'number' && (
            <div className="book-cost">
              {curso.costo > 0 ? `$${curso.costo}` : 'Gratis'}
            </div>
          )}
          {curso.tipo === "Asíncrono" ? <button className="btn primary" 
          onClick={()=>{
            if (!user) {
              localStorage.setItem("pendingCartItem", JSON.stringify(curso));
              setShowModalAdquirir(true);
              setTimeout(() => {
                navigate('/login', { state: { redirectTo: '/checkout' } });
              }, 2500);
            } else{
              addToCart(curso);
              navigate('/checkout');
            }}}
          >Adquirir</button> : 
          <button className="btn primary"
          onClick={()=>{
            if (!user) {
                localStorage.setItem("pendingCartItem", JSON.stringify(curso));
                setShowModalInscribirse(true);
                setTimeout(() => {
                  navigate('/login', { state: { redirectTo: '/checkout' } });
                }, 2500);
              } else{
                addToCart(curso);
                navigate('/checkout');
              }}}
          >Inscribirse</button>
          }
        </div>
      </section>

      {descarga && (
        <div className="overlay-loading">
          <div className="overlay-content">
            <CircularProgress />
            <p>Descargando...</p>
          </div>
        </div>
      )}

      <InfoModal
        open={showModalAdquirir}
        title="Debes iniciar sesión para poder adquirir este curso."
        message="Redirigiendo..."
      />
      <InfoModal
        open={showModalInscribirse}
        title="Debes iniciar sesión para poder inscribirte a este curso."
        message="Redirigiendo..."
      />
      <InfoModal
        open={msjError}
        title="Hubo un error al descargar el archivo"
        message="Favor de intentarlo mas tarde, en caso de seguir presentando fallas, porfavor contactanos para que podamos ayduarte"
      />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
