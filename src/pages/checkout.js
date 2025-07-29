import React, { useEffect, useRef } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { useCart } from '../contexts/cartContext/CartContext';
import '../styles/checkout.css';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const paypalRef = useRef();
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
      return () => { document.body.removeChild(script); };
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
        onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
            alert('Pago completado por ' + details.payer.name.given_name);
            clearCart();
            });
        },
        onError: (err) => {
            console.error('Error en el pago:', err);
            alert('Error en el pago');
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
