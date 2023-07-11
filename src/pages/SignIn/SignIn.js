import React, { useEffect } from "react";
import banner from "../../assets/images/banner-1.svg";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Cookies from "js-cookie";
import NavPopup from "../../components/NavPopup/NavPopup";
import Swal from "sweetalert2";
import "../../App.scss";
import Routes from "../../routes/route";
import { CartContext } from "../../context/CartContext";
import {
  getAllWishlistItems,
  getIncompleteOrders,
} from "../../fetchAndPostDatas/fetchData";
import { addQuantity } from "../../helperFunctions/cartFunctions";
import { encryptDatas } from "../../helperFunctions/encryptData";
import CryptoJS from "crypto-js";
import { login } from "../../fetchAndPostDatas/postData";

const SignIn = () => {
  const [email, setEmail] = useState(
    localStorage.getItem("email") ? localStorage.getItem("email") : ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") ? setPasswordFromLocalStorage() : ""
  );
  const [seePassword, setSeePassword] = useState(false);
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe")
  );
  const { cart, setCart } = useContext(CartContext);
  const { setWishList } = useContext(CartContext);
  const localCartData = localStorage.getItem("cartData");
  const { routeChange } = Routes();
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  function setPasswordFromLocalStorage() {
    const bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("password"),
      process.env.REACT_APP_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    return bytes;
  }

  const handleSignIn = async (e) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      iconColor: "white",
      customClass: {
        popup: "colored-toast",
      },
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    e.preventDefault();
    if (email.trim() === "") {
      await Toast.fire({
        icon: "error",
        title: `Enter email!`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!email.match(mailFormat)) {
      await Toast.fire({
        icon: "error",
        title: `Enter valid email!`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (password.trim() === "") {
      await Toast.fire({
        icon: "error",
        title: `Enter Password!`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      let cipherPassword = CryptoJS.AES.encrypt(
        password,
        process.env.REACT_APP_SECRET_KEY
      ).toString();
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", cipherPassword);
        localStorage.setItem("rememberMe", rememberMe);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }
      const response = await login(email, password);
      if (!response.error) {
        if (response.success) {
          Cookies.set("token", response.token);
          setUserDetails(response.userDetails);
          encryptDatas("userData", response.userDetails);
          wishlistedFood(response.userDetails._id);
          if (localCartData !== null) {
            const data = JSON.parse(localCartData);
            setCart(data);
          }
          <NavPopup token={response.token} />;
        } else {
          await Toast.fire({
            icon: "error",
            title: `${response.response.data.message}`,
          });
        }
      } else {
        console.log(response.error.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userDetails && Cookies.get("token")) {
      if (localCartData !== null) {
        if (cart.length > 0) {
          getIncompleteOrders(userDetails._id).then((res) => {
            if (res.success && res.data !== null) {
              res.data.incompleteItems.map((item) =>
                addQuantity(cart, setCart, item, 0)
              );
              routeChange("/");
            } else {
              routeChange("/");
            }
          });
        }
      } else {
        getIncompleteOrders(userDetails._id).then((res) => {
          if (res.success) {
            if (res.data !== null) {
              res.data.incompleteItems.map((item) =>
                addQuantity(cart, setCart, item, 0)
              );
            }
            routeChange("/");
          }
        });
      }
    }
  }, [cart, userDetails, localCartData]);

  const wishlistedFood = (userId) => {
    getAllWishlistItems(userId).then((res) => {
      if (res.success && res.data !== null) {
        setWishList(res.data.items);
      }
    });
  };

  return (
    <div className="overflow-hidden h-[100vh]">
      <img
        src={banner}
        className="scale-250 md:scale-150 w-full my-16 ms-5 md:ms-[-18%]"
        alt="banner"
      />
      <div className="xl:fixed absolute lg:top-[25%] 2xl:top-[20%] top-[40%] ms-5 sm:ms-0 w-[86%] sm:w-[50%] sm:left-[25%] bg-[#ffff] p-5  sm:shadow-[0_0_20px_0_rgba(0,0,0,0.15)] login-popup rounded-lg">
        <p className="text-2xl font-semibold">Welcome Back !</p>
        <p className="text-[#7F8490] mb-5">Please enter your details</p>
        <p className="text-[#3F414F] my-2">Email Id</p>
        <input
          className="border rounded p-2 w-full text-[#3F414F] outline-0"
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <p className="text-[#3F414F] my-2">Password</p>
        <div className="border rounded w-full flex justify-between items-center">
          <input
            className="text-[#3F414F] p-2 outline-0"
            type={seePassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <i
            className="fas fa-light fa-eye p-2"
            onClick={() => {
              seePassword ? setSeePassword(false) : setSeePassword(true);
            }}
          ></i>
        </div>
        <div className="flex justify-between my-3">
          <div className="flex">
            <input
              type="checkbox"
              className="me-1 sm:me-2"
              onChange={(e) => {
                setRememberMe(e.target.checked);
              }}
              defaultChecked={localStorage.getItem("rememberMe") ? true : false}
            />
            <p className="sm:text-base text-xs">Remember me</p>
          </div>
          <Link to="/set-password">
            <p className="text-[#EB722C] sm:text-base text-xs">
              Forgot Password?
            </p>
          </Link>
        </div>
        <button
          onClick={handleSignIn}
          type="submit"
          className="text-lg bg-[#25CA80] text-white px-20 p-3 rounded-3xl mt-5 mb-3 w-full"
        >
          SIGN IN
        </button>
        <p className="text-center text-[#5B5B5B] mb-2 sm:text-base text-xs">
          Don't have an account?
          <button className="text-[#EB722C] px-1">
            <Link to="/sign-up"> Signup </Link>
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
