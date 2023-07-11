import React, { useState, useContext } from "react";
import Routes from "../../routes/route";
import CurrentOrders from "../../components/Orders/CurrentOrder";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getOrderById } from "../../fetchAndPostDatas/fetchData";
import Loading from "../../components/Loading/Loading";
import { addQuantity } from "../../helperFunctions/cartFunctions";
import { CartContext } from "../../context/CartContext";
import { socket } from "../../config/socketConnection";

const CurrentOrderPage = () => {
  const userData = useParams();
  const { routeChange } = Routes();
  const [currentOrders, setCurrentOrders] = useState();
  const [date, setDate] = useState("");
  const { cart, setCart } = useContext(CartContext);

  const addOrder = () => {
    currentOrders.orderItems.forEach((element) => {
      addQuantity(cart, setCart, element, 0);
    });
    routeChange("/cart");
  };

  useEffect(() => {
    getOrderById(userData.id).then((res) => {
      setCurrentOrders(res.data);
      setDate(new Date(res.data.updatedAt).toString().substring(4, 10));
    });
  }, []);

  useEffect(() => {
    socket.on(userData.userId, (data) => {
      if (currentOrders !== undefined) {
        if (currentOrders._id === data.orderId) {
          setCurrentOrders({ ...currentOrders, orderStatus: data.orderStatus });
        }
      }
    });
  }, [socket, currentOrders]);

  if (currentOrders) {
    return (
      <div className="max-h-screen overflow-scroll">
        <div className="flex">
          <i
            className="fas fa-regular fa-arrow-left pt-6 ps-2 cursor-pointer"
            onClick={() => {
              routeChange("/order");
            }}
          ></i>
          <div className="ms-2 mt-3">
            <p className="text-[#092C4C] font-semibold text-sm">
              ORDER
              <span className="ms-2">
                {currentOrders ? currentOrders._id : "#11948481486"}
              </span>
            </p>
            <p className="text-[#A8ACB0] font-normal text-xs">
              {currentOrders ? currentOrders.orderStatus : "Ready to delivery"}
              <span className="h-[0.5rem] border-[2px] mx-1"></span>
              <span>
                {currentOrders
                  ? currentOrders.orderItems
                    ? currentOrders.orderItems.length
                    : ""
                  : ""}
              </span>{" "}
              Item ₹
              <span>{currentOrders ? currentOrders.totalAmount : "0"}</span>
            </p>
          </div>
        </div>
        <div className="mb-16">
          <CurrentOrders
            currentOrders={currentOrders}
            date={date}
            limit={
              currentOrders
                ? currentOrders.orderItems
                  ? currentOrders.orderItems.length
                  : 0
                : 0
            }
            path={`/ordersdetails/current/${currentOrders._id}/${userData.userId}`}
          />
        </div>
        <div className="flex justify-center my-4 items-center absolute bottom-0 w-full">
          <button
            className="rounded-full bg-[#FF6D5D] w-3/5 py-2 text-white md:w-1/5 text-center"
            onClick={() => {
              addOrder();
            }}
          >
            REORDER
          </button>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default CurrentOrderPage;
