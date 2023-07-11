import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});
  const [cartData, setCartData] = useState("");
  const [selectedCategoryImage, setSelectedCategoryImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const valueObj = {
    userDetails,
    setUserDetails,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryImage,
    setSelectedCategoryImage,
    cartData,
    setCartData,
  };
  return (
    <GlobalContext.Provider value={valueObj}>{children}</GlobalContext.Provider>
  );
};
