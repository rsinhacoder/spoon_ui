import React, { useEffect, useState, useContext } from "react";
import NoItem from "../../components/NoItem/NoItem";
import Routes from "../../routes/route";
import WishlistItems from "../../components/WishlistItem/WishlistItem";
import { GlobalContext } from "../../context/GlobalContext";
import Cookies from "js-cookie";
import DishAdded from "../../components/DishesCategories/DishAdded";
import { decryptDatas } from "../../helperFunctions/encryptData";
import { CartContext } from "../../context/CartContext";

const Wishlist = () => {
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const { routeChange } = Routes();
  const [noItemWishlisted, setNoItemWishlisted] = useState(false);
  const [addDish, setAddDish] = useState(false);
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    if (Cookies.get("token")) {
      setUserDetails(decryptDatas("userData"));
    }
    if (localStorage.getItem("wishListItems") !== null) {
      setNoItemWishlisted(true);
    } else {
      setNoItemWishlisted(false);
    }
    if (localStorage.getItem("cartData") !== null) {
      setCart(JSON.parse(localStorage.getItem("cartData")));
    }
  }, []);

  useEffect(() => {
    if (!userDetails || !Cookies.get("token")) {
      routeChange("/sign-up");
      return;
    }
  }, []);

  return (
    <div>
      <div className="flex items-end mb-5">
        <i
          className="fas fa-regular fa-arrow-left cursor-pointer p-3 ps-2"
          onClick={() => {
            routeChange("/");
          }}
        ></i>
        <div className="ms-5 font-semibold pb-2">Your Wishlist</div>
      </div>
      {noItemWishlisted ? (
        <WishlistItems setAddDish={setAddDish} />
      ) : (
        <NoItem />
      )}
      {addDish && <DishAdded />}
    </div>
  );
};

export default Wishlist;
