import React, { useContext, useState } from "react";
import CartItem from "../../components/CartItem/CartItems";
import OrderConfirm from "../../components/CartItem/OrderPlaced";
import Routes from "../../routes/route";
import location from "../../assets/images/location.svg";
import { CartContext } from "../../context/CartContext";
import { generateOrder } from "../../fetchAndPostDatas/postData";
import { GlobalContext } from "../../context/GlobalContext";
import DropDown from "../../components/DropDown/DropDown";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "../../App.scss";
import { cartPrice } from "../../helperFunctions/cartFunctions";
import { geoloc } from "../../helperFunctions/geoLocation";
import { getAllFoodItems } from "../../fetchAndPostDatas/fetchData";
import Loading from "../../components/Loading/Loading";
import { decryptDatas } from "../../helperFunctions/encryptData";
import { socket } from "../../config/socketConnection";

const Cart = () => {
  const [orderConfirm, setOrderConfirm] = useState(false);
  const { cart, setCart } = useContext(CartContext);
  const [userAddress, setUserAddress] = useState("");
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [grandTotal, setGrandTotal] = useState(0);
  const [foodItems, setFoodItems] = useState();
  const price = cartPrice(cart);
  const options = [
    { label: "Current location", value: "CurrentLocation" },
    { label: "Home", value: "Home" },
  ];

  const changeAddress = (e) => {
    setUserAddress("");
    if (e.target.value === "Home") {
      if (!userDetails._id) {
        Swal.fire({
          icon: "warning",
          text: "Please sign-in!",
          timer: 1000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          routeChange("/sign-in");
        }, 1000);
      }
      if (userDetails._id) {
        if (!userDetails.address) {
          Swal.fire({
            icon: "warning",
            text: "Please update your address first!",
            timer: 1000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            routeChange("/profile");
          }, 1000);
        }
        setUserAddress(userDetails.address);
      }
    } else {
      geoloc(setUserAddress);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      geoloc(setUserAddress);
    }
  }, [setUserAddress]);

  useEffect(() => {
    socket.on("categoryAvailability", (data) => {
      if (data) {
        window.location.reload();
      }
    });
  }, [socket]);

  const addOrder = async () => {
    if (Cookies.get("token")) {
      if (userDetails) {
        if (userDetails.userName) {
          placeOrder();
        } else {
          Swal.fire({
            icon: "warning",
            text: "Please update your name!",
            timer: 1000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            routeChange("/profile");
          }, 1000);
        }
        return;
      } else {
        setCart([]);
        routeChange("/sign-up");
        setOrderConfirm(false);
      }
    } else {
      setCart([]);
      routeChange("/sign-up");
    }
  };

  const { routeChange } = Routes();

  const placeOrder = () => {
    if (!userAddress) {
      Swal.fire({
        icon: "warning",
        text: "Please wait while we are fetching your address... ",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    generateOrder(cart, userDetails, userAddress, grandTotal).then((res) => {
      if (res.response) {
        if (res.response.data.success === false) {
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: `${res.response.data.message}`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } else {
        if (res.data.success) {
          socket.emit("orders", { order: true });
          setOrderConfirm(true);
          setTimeout(() => {
            setCart([]);
            window.localStorage.removeItem("cartData");
            routeChange("/order");
          }, 2000);
        }
      }
    });
  };

  useEffect(() => {
    setGrandTotal(price + 16);
  }, [price]);

  useEffect(() => {
    if (cart.length === 0) {
      if (localStorage.getItem("cartData") !== null) {
        setCart(JSON.parse(localStorage.getItem("cartData")));
      }
    } else {
      localStorage.setItem("cartData", JSON.stringify(cart));
    }
  }, [setCart]);

  useEffect(() => {
    if (Cookies.get("token")) {
      const userDetail = decryptDatas("userData");
      if (localStorage.getItem("userData") !== null) {
        if (userDetail) {
          setUserDetails(userDetail);
        }
      }
    }
  }, []);

  useEffect(() => {
    getAllFoodItems().then((res) => {
      setFoodItems(res.data);
    });
  }, []);

  if (cart.length < 1 && foodItems) {
    return (
      <div>
        <i
          className="fas fa-regular fa-arrow-left cursor-pointer pt-6 ps-2"
          onClick={() => {
            routeChange("/");
          }}
        ></i>
        <div className="flex justify-center items-center flex-col">
          <img
            src="https://res.cloudinary.com/doq4h14oa/image/upload/v1684754438/empty_cart_e1hj3y.webp"
            className="my-5 w-1/3"
            alt="cartEmpty"
          />
          <p className="font-semibold">Your cart is empty</p>
          <button
            className="border-2 border-xl bg-[#fc8019] px-2 text-white"
            onClick={() => {
              routeChange("/");
            }}
          >
            See more foods
          </button>
        </div>
      </div>
    );
  }

  if (!foodItems) {
    return <Loading />;
  }

  return (
    <div>
      <i
        className="fas fa-regular fa-arrow-left cursor-pointer pt-6 ps-2"
        onClick={() => {
          routeChange("/");
        }}
      ></i>
      {cart && localStorage.setItem("cartData", JSON.stringify(cart))}
      {cart &&
        cart.map((data, index) => (
          <CartItem cartData={data} key={index} foodItems={foodItems} />
        ))}
      <div className="shadow-[0px_4.84507px_30.2817px_rgba(89,79,75,0.1)] border-2 rounded-lg mx-2 px-2 relative">
        <p className="mt-4">Billing Details</p>
        <div className="flex justify-between my-4">
          <p>Item total</p>
          <p className="font-semibold">₹{price}</p>
        </div>
        <div className="flex justify-between my-4">
          <p>Taxs & Charges</p>
          <p className="font-semibold">₹16.00</p>
        </div>
        <div className="flex justify-between my-4">
          <p>Grand Total</p>
          <p className="text-[#25CA80] font-semibold text-lg">₹{grandTotal}</p>
        </div>
        <p className="my-4 text-[#808080] font-normal text-xs">
          Check the receipt or invoice to verify the charges. Make sure that all
          items you ordered are listed and that the prices are correct.
        </p>
      </div>
      <div className="shadow-[0px_4.84507px_30.2817px_rgba(89,79,75,0.1)] border-2 rounded-lg mx-2 px-2 mt-3 relative">
        <p className="my-4 text-[#808080] font-normal text-s">
          Choose the location of the delivey{" "}
        </p>
        {userAddress && (
          <div className="flex items-center">
            <img src={location} className="w-6 h-6" alt="location-icon" />
            <DropDown options={options} onChange={changeAddress} />
          </div>
        )}
        <div className="text-xs text-[#757575] mb-2 md:text-base overflow-hidden">
          {userAddress ? (
            <p className="ps-7">{userAddress}</p>
          ) : (
            <div className="flex items-center justify-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-center relative mb-[6rem] top-20">
        <button
          className="rounded-full bg-[#FF6D5D] w-4/5 md:w-2/5 h-[7vh] lg:w-1/5 text-white"
          onClick={() => {
            addOrder();
          }}
        >
          ORDER NOW
        </button>
      </div>
      {orderConfirm ? <OrderConfirm setOrderConfirm={setOrderConfirm} /> : ""}
    </div>
  );
};

export default Cart;
