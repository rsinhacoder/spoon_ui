import React, { useContext, useEffect } from "react";
import Routes from "../../routes/route";
import { CartContext } from "../../context/CartContext";
import { cartPrice } from "../../helperFunctions/cartFunctions";

const DishAdded = () => {
  const { cart } = useContext(CartContext);
  const { routeChange } = Routes();
  const price = cartPrice(cart);

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="dish-added-effect fixed bottom-0 w-full left-0 md:-bottom-4 bg-gradient z-30">
      <div className="flex justify-between items-center bg-[#179F63] text-white rounded-md py-3 px-5 absolute w-full bottom-5 shadow-effect">
        <div className="flex gap-2">
          <p>{cart ? (cart.length > 0 ? cart.length : "") : ""} Item</p>
          <span className="h-[1.3rem] border-2"></span>
          <p>
            ₹<span>{price}</span>
          </p>
        </div>
        <div className="flex">
          <span
            onClick={() => {
              routeChange("/cart");
            }}
            className="cursor-pointer"
          >
            View Cart
          </span>
        </div>
      </div>
    </div>
  );
};

export default DishAdded;
