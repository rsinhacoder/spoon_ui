import { useState, createContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishList] = useState([]);

  const valueObj = {
    cart,
    setCart,
    wishlist,
    setWishList,
  };

  return (
    <CartContext.Provider value={valueObj}>{children}</CartContext.Provider>
  );
};
