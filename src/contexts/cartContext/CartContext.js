import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../authContext/AuthContext";
const CartContext = React.createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState(() => {
    if(user){
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Cuando cambia el usuario, resetea el carrito si no hay usuario
  useEffect(() => {
    if (!user) {
      setCart([]);
      localStorage.removeItem('cart'); 
    } else {
      
      const stored = localStorage.getItem('cart');
      setCart(stored ? JSON.parse(stored) : []);
    }
    // eslint-disable-next-line
  }, [user]);

  // Solo persiste el carrito si hay usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (item) => {
    setCart(prev => {
      // Evita duplicados por id
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}