import React from "react";
import home from "../../assets/images/home.svg";
import cart from "../../assets/images/cart.svg";
import wishList from "../../assets/images/wishlist.svg";
import profile from "../../assets/images/profile.svg";
import Routes from "../../routes/route";
import "./Navbar.scss";
import Cookies from "js-cookie";

const Navbar = () => {
  const { routeChange } = Routes();
  return (
    <div className="flex lg:hidden justify-between px-16 sm:px-10 fixed bottom-0 w-full py-5 shadow-[0px_-2px_20px_rgba(0,0,0,0.2)] z-20 bg-[#ffff]">
      <img
        src={home}
        className="hover-icons"
        onClick={() => {
          routeChange("/");
        }}
        alt="home"
      />
      <img
        src={cart}
        className="hover-icons"
        alt="cart"
        onClick={() => {
          routeChange("/cart");
        }}
      />
      <img
        src={wishList}
        className="hover-icons"
        alt="wishlist"
        onClick={() => {
          if (!Cookies.get("token")) {
            routeChange("/sign-up");
            return;
          }
          routeChange("/wishlist");
        }}
      />
      <img
        src={profile}
        className="hover-icons"
        alt="profile"
        onClick={() => {
          if (!Cookies.get("token")) {
            routeChange("/sign-up");
            return;
          }
          routeChange("/profile");
        }}
      />
    </div>
  );
};

export default Navbar;
