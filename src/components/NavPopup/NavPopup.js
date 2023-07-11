import React, { useContext } from "react";
import Routes from "../../routes/route";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./NavPopup.scss";
import { CartContext } from "../../context/CartContext";
import { GlobalContext } from "../../context/GlobalContext";
import { logout } from "../../helperFunctions/logoutFunction";
import Cookies from "js-cookie";

const NavPopup = ({ setNavPopup }) => {
  const { routeChange } = Routes();
  const localData = localStorage.getItem("cartData");
  const wishlistItems = localStorage.getItem("wishListItems");
  const { userDetails } = useContext(GlobalContext);
  const { setCart } = useContext(CartContext);
  const { setWishList } = useContext(CartContext);

  const handleLogOut = () => {
    logout(localData, userDetails, wishlistItems).then((res) => {
      if (res === 2) {
        Cookies.remove("token");
        localStorage.removeItem("cartData");
        localStorage.removeItem("wishListItems");
        localStorage.removeItem("userData");
        setCart([]);
        setWishList([]);
        routeChange("/sign-in");
      }
    });
  };

  return (
    <div
      className="rounded bg-white p-3 lg:flex flex-col w-[10rem] hidden absolute top-20 end-10 z-10 border shadow-[0px_2px_50px_rgba(0,0,0,0.25)]"
      onClick={() => {
        setNavPopup(false);
      }}
    >
      <div className="flex profile-hover py-2">
        <AccountCircleIcon className="mx-2 text-gray-500 profile-icon" />
        <p
          className="cursor-pointer profile-text"
          onClick={() => {
            routeChange("/profile");
          }}
        >
          My Profile
        </p>
      </div>
      <div className="flex profile-hover py-2">
        <ShoppingCartIcon className="mx-2 text-gray-500 profile-icon" />
        <p
          className="cursor-pointer profile-text"
          onClick={() => {
            routeChange("/cart");
          }}
        >
          My Cart
        </p>
      </div>
      <div className="flex py-2">
        <LocalMallIcon className="mx-2 text-teal-700" />
        <p
          className="cursor-pointer hover:text-[#25CA80]"
          onClick={() => {
            routeChange("/order");
          }}
        >
          My Orders
        </p>
      </div>
      <div
        className="flex py-2"
        onClick={() => {
          routeChange("/wishlist");
        }}
      >
        <FavoriteIcon className="text-red-600 mx-2" />
        <p className="cursor-pointer hover:text-[#25CA80]">Wishlist</p>
      </div>
      {userDetails._id && (
        <div className="flex logout-hover py-2" onClick={handleLogOut}>
          <LogoutIcon className="mx-2 text-gray-300 logout-icon" />
          <p className="cursor-pointer logout-text">Logout</p>
        </div>
      )}
    </div>
  );
};

export default NavPopup;
