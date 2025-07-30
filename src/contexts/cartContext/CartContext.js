import React, { useEffect, useState, useContext } from "react";
const CartContext = React.createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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