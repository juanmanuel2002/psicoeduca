import React, { useContext } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import '../styles/recursoGuia.css';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext/AuthContext';
import InfoModal from '../components/ui/InfoModal';
import { useCart } from '../contexts/cartContext/CartContext';

const BOOK_IMG = '/portada_libro.png';
const BOOK_COST = 199;

let libro = {
    id: "o6xfyFXg0g4zimGVDncq",
    imagenFutura: BOOK_IMG,
    nombre: 'English for everyone - Basic book',
    costo: BOOK_COST,
}

export default function RecursoGuia() {
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = React.useState(false);

  const handleAdquirir = () => {
    if (!user) {
      setShowModal(true);
      localStorage.setItem("pendingCartItem", JSON.stringify(libro));
      setTimeout(() => {
        navigate('/login', { state: { redirectTo: '/checkout' } });
      }, 2000);
    } else {
        addToCart(libro);
        navigate('/checkout');
    }
  };

  return (
    <div className="home-container">
      <Header />
      <section className="recurso-section" data-aos="fade-up">
        <div className="recurso-header">
          <MenuBookIcon className="recurso-icon" />
          <h2>English for everyone - Basic book</h2>
          <p className="recurso-desc">
            El libro perfecto para comenzar tu aprendizaje. 
            Contiene explicaciones claras, ejercicios prácticos 
            y material diseñado para todos los niveles.
          </p>
        </div>

        <div className="recurso-body">
          <div className="recurso-img">
            <img
              src={BOOK_IMG}
              alt="English for everyone - Basic book"
            />
          </div>

          <div className="recurso-details">
            <div className="book-cost">
              <span className="actual">${BOOK_COST} MXN</span>
              <span className="before">$259</span>
            </div>
            <ul className="benefits">
              <li>📘 Contenido progresivo: básico a intermedio</li>
              <li>📝 Ejercicios prácticos incluidos</li>
              <li>🎧 Recursos adicionales en línea</li>
              <li>💡 Ideal para autoestudio</li>
            </ul>
            <div className="actions">
              <button className="btn primary" onClick={handleAdquirir}>
                Adquirir ahora
              </button>
             
            </div>
          </div>
        </div>
      </section>

      <InfoModal
        open={showModal}
        title="Debes iniciar sesión para adquirir el libro"
        message="Redirigiendo..."
      />
      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
