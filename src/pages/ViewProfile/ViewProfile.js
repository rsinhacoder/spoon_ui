import React, { useContext, useEffect } from "react";
import arrow from "../../assets/images/arrow.svg";
import Routes from "../../routes/route";
import { GlobalContext } from "../../context/GlobalContext";
import default_dp from "../../assets/images/default_dp.png";
import Cookies from "js-cookie";
import { logout } from "../../helperFunctions/logoutFunction";
import { CartContext } from "../../context/CartContext";
import { decryptDatas } from "../../helperFunctions/encryptData";

const ViewProfile = () => {
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const { routeChange } = Routes();
  const localData = localStorage.getItem("cartData");
  const wishlistItems = localStorage.getItem("wishListItems");
  const { setCart, setWishList } = useContext(CartContext);

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

  useEffect(() => {
    if (localStorage.getItem("userData") !== null) {
      setUserDetails(decryptDatas("userData"));
    }
    if (!Cookies.get("token")) {
      routeChange("/sign-up");
    }
  }, []);

  if (userDetails) {
    return (
      <div className="w-full sm:w-[40rem] sm:m-auto sm:p-5 sm:mt-10 sm:rounded-lg sm:shadow-[0_0_20px_0_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between px-2">
          <div className="flex m-3">
            <img
              src={arrow}
              alt="arrow"
              onClick={() => {
                routeChange("/");
              }}
              className="cursor-pointer"
            />
            <p className="ms-2 font-semibold">Home</p>
          </div>
          <p
            className="text-[#EB722C] cursor-pointer"
            onClick={() => {
              routeChange("/editprofile");
            }}
          >
            Edit Details
          </p>
        </div>
        <div className="flex justify-center flex-col items-center mt-10">
          <img
            src={userDetails.imageURL ? `${userDetails.imageURL}` : default_dp}
            className="rounded-lg my-3 min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px] md:min-w-[90px] md:max-w-[90px] md:min-h-[90px] md:max-h-[90px]"
            alt="user"
          />
          <p className="font-semibold text-[#444A61]">
            {userDetails.userName ? userDetails.userName : "Name"}
          </p>
        </div>

        <p className="font-semibold px-5 mt-10 text-[#444A61]">
          Email Id :{" "}
          <span className="font-light text-[#888D92]">
            {userDetails.email ? userDetails.email : "email"}
          </span>
        </p>
        <p className="font-semibold px-5 mt-5 text-[#444A61]">
          Phone No:{" "}
          <span className="font-light text-[#888D92]">
            {userDetails.phoneNumber ? userDetails.phoneNumber : "phoneNumber"}
          </span>
        </p>
        <p className="font-semibold px-5 mt-5 mb-10 text-[#444A61]">
          Address :{" "}
          <span className="font-light text-[#888D92]">
            {userDetails.address ? userDetails.address : "address"}
          </span>
        </p>
        <div className="px-5 mt-10 mb-3">
          <button
            className="bg-[#FF6D5D] text-white w-full py-3 rounded-full lg:hidden flex m-auto justify-center"
            onClick={handleLogOut}
          >
            LOGOUT
          </button>
        </div>
      </div>
    );
  } else {
    return routeChange("/sign-up");
  }
};

export default ViewProfile;
