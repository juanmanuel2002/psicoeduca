import React, { useEffect, useRef, useContext } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { useCart } from '../contexts/cartContext/CartContext';
import { AuthContext } from '../contexts/authContext/AuthContext';
import { sendEmailCompra, updateProductOrResources} from '../services/sendEmailService';
import { useNavigate } from 'react-router-dom';
import '../styles/checkout.css';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const paypalRef = useRef();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + (item.costo > 0 ? item.costo : 0), 0);

  useEffect(() => {
    if (!cart.length || total === 0) return;
    // Cargar el script de PayPal solo si no existe
    const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
    if (!clientId) {
        console.error('PayPal Client ID no definido. Verifica tu archivo .env');
        return;
    }

    if (!document.getElementById('paypal-sdk')) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=MXN&locale=es_MX`;
      script.id = 'paypal-sdk';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        const interval = setInterval(() => {
            if (window.paypal) {
            clearInterval(interval);
            renderPaypal();
            }
        }, 100);
      };
      return () => {
        if (script && script.parentNode === document.body) {
            document.body.removeChild(script);
        }
      };
    } else {
      renderPaypal();
    }
    // eslint-disable-next-line
  }, [cart, total]);

  function renderPaypal() {
    if (window.paypal && paypalRef.current) {
        // Evita re-render si ya fue renderizado
        if (paypalRef.current.hasChildNodes()) return;

        window.paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
            purchase_units: [{
                amount: { value: total.toString() },
                description: 'Pago de carrito Psicoeduca',
            }],
            });
        },
        onApprove: async (data, actions) => {
        try {
            const details = await actions.order.capture();
            alert('✅ Pago completado por ' + details.payer.name.given_name);

            // Espera que el correo se mande
            const response = await sendEmailCompra({ correo: user.email, nombre: user.name, cart });
            const updateUser = await updateProductOrResources({correo: user.email, cart})

            if (!response.ok || !updateUser.ok) {
            throw new Error('Error al enviar el correo de compra o actualizar usuario en db');
            }

            clearCart();
            navigate('/home', { replace: true });
        } catch (err) {
            console.error('Error tras completar el pago:', err);
            alert('✅ El pago se procesó correctamente, pero hubo un error al enviar los recursos. Por favor contáctanos para que podamos ayudarte lo antes posible.');
        }
        },
        onError: (err) => {
            console.error('Error en el pago:', err);
            alert('Error en el pago, favor de intentar nuevamente');
        }
        }).render(paypalRef.current);
    }
   }


  return (
    <div className="home-container">
        <Header />
        <section className="checkout-section">
        <h2 className="checkout-title">Mi Pedido</h2>
        {cart.length === 0 ? (
            <div className="empty-cart-msg">Tu carrito está vacío</div>
        ) : (
            <>
            <div className="cart-list">
                {cart.map((item, idx) => (
                <div className="cart-item" key={item.id || idx}>
                    <img
                    src={item.imagenFutura || '/baner.png'}
                    alt={item.nombre}
                    className="cart-item-img"
                    />
                    <div className="cart-item-name">{item.nombre}</div>
                    <div className="cart-item-price">
                    {item.costo > 0 ? `$${item.costo}` : 'Gratis'}
                    </div>
                </div>
                ))}
            </div>
            <div className="cart-total">
                <span className="total-label">Total:</span>
                <span className="total-amount">{`$${total}`}</span>
            </div>
            <div ref={paypalRef} className="paypal-container"></div>
            </>
        )}
        </section>
        <WhatsAppFloat />
        <Footer />
    </div>
    );

}
