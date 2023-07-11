import React, { useState, useEffect, useContext } from "react";
import Routes from "../../routes/route";
import CurrentOrders from "../../components/Orders/CurrentOrder";
import {
  getCurrentOrders,
  getAllPastOrders,
  getItemDetails,
} from "../../fetchAndPostDatas/fetchData";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import RateOrders from "../../components/RateOrders/RateOrders";
import NoOrders from "../../components/Orders/NoOrders";
import Cookies from "js-cookie";
import { CartContext } from "../../context/CartContext";
import { addQuantity } from "../../helperFunctions/cartFunctions";
import { decryptDatas } from "../../helperFunctions/encryptData";
import { socket } from "../../config/socketConnection";
import { GlobalContext } from "../../context/GlobalContext";

const Order = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [showRating, setShowRating] = useState(false);
  const limit = 2;
  const [haveCurrentOrder, setHaveCurrentOrder] = useState(false);
  const [havePastOrder, setHavePastOrder] = useState(false);
  const [pastOrderDesc, setPastOrderDesc] = useState("");
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const { cart, setCart } = useContext(CartContext);

  const { routeChange } = Routes();

  useEffect(() => {
    if (!Cookies.get("token")) {
      routeChange("/sign-in");
    }

    const userDetail = decryptDatas("userData");
    if (userDetail) {
      setUserDetails(userDetail);
      orders(userDetail);
    }

    if (localStorage.getItem("cartData") !== null) {
      setCart(JSON.parse(localStorage.getItem("cartData")));
    }
  }, []);

  useEffect(() => {
    if (userDetails) {
      socket.on(userDetails._id, (data) => {
        orders(userDetails);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (pastOrders.length) {
      getItemDetails(pastOrders[0].orderItems[0].itemId).then((response) => {
        setPastOrderDesc(response.data.item.description);
      });
    }
  }, [pastOrders]);

  const orders = (userDetail) => {
    getAllPastOrders(userDetail._id).then((response) => {
      if (response.data.length) {
        setPastOrders(response.data);
      }
      setHavePastOrder(true);
    });
    getCurrentOrders(userDetail._id).then((response) => {
      if (response.data.length) {
        setCurrentOrders(response.data);
      }
      setHaveCurrentOrder(true);
    });
  };

  const addItem = () => {
    addQuantity(cart, setCart, pastOrders[0].orderItems[0], 0);
    setTimeout(() => {
      routeChange("/cart");
    }, 1000);
  };

  if (!haveCurrentOrder || !havePastOrder) {
    return <Loading />;
  }
  return (
    <>
      {currentOrders.length || pastOrders.length ? (
        <div>
          <i
            className="fas fa-regular fa-arrow-left pt-6 ps-2 cursor-pointer"
            onClick={() => {
              routeChange("/");
            }}
          ></i>
          <div>
            <p className="ps-2 pt-5 font-semibold text-base text-start">
              Current Orders
            </p>
            {currentOrders.length ? (
              <div className="max-h-72 md:max-h-[30rem] overflow-scroll flex flex-col-reverse">
                {currentOrders &&
                  currentOrders.map((data, index) => {
                    return (
                      <CurrentOrders
                        currentOrders={data}
                        limit={limit}
                        key={index}
                        path={`/currentorderspage/${data._id}/${userDetails._id}`}
                      />
                    );
                  })}
              </div>
            ) : (
              <div>
                <NoOrders title="current order yet" />
              </div>
            )}
          </div>
          <div className="bg-[#F6F6F6] mt-5">
            <p className="py-4 ps-3 font-semibold text-[#415161] text-sm">
              Past Order
            </p>
          </div>
          {pastOrders.length ? (
            <div className="px-3 mb-3 ">
              <div className="flex justify-between mb-3 border border-b-1 border-dotted border-x-0 border-t-0 py-3 ">
                <div className="w-2/5 ">
                  <p className="leading-5 font-medium">
                    {pastOrders[0].orderItems[0].itemName}
                  </p>
                  <p className="font-normal text-sm text-[#888D92] mt-1">
                    ₹ {pastOrders[0].orderItems[0].price}
                  </p>
                </div>
                <p className="text-[#25CA80] text-xm font-bold pe-3">
                  Delivered
                </p>
              </div>
              <p className="text-[#888D92] font-normal text-sm mt-5">
                {pastOrderDesc}
              </p>
              <span className="flex gap-5 mt-3 text-[#3E3F41] font-normal text-xs">
                <p>{pastOrders[0].orderCompleteDate}</p>
                <span>{pastOrders[0].orderCompleteTime}</span>
              </span>
              {showRating ? (
                <RateOrders
                  showRating={showRating}
                  setShowRating={setShowRating}
                />
              ) : (
                <>
                  <div className="mt-7 mb-6">
                    <Link
                      to="#"
                      className="rounded-full py-2 px-6 border-2 border-[#221E1C] font-semibold text-lg text-[#221E1C]"
                      onClick={addItem}
                    >
                      Reorder
                    </Link>
                    <Link
                      className="rounded-full py-2 px-6 border-2 border-[#FF6D5D] font-semibold text-lg text-[#FF6D5D] ms-4"
                      onClick={() => setShowRating(!showRating)}
                    >
                      Rate Food
                    </Link>
                  </div>
                  <Link
                    to={"/oldorders"}
                    className="text-[#EB722C] font-semibold text-xs "
                  >
                    View More Orders
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <NoOrders title="past order yet" />
            </div>
          )}
        </div>
      ) : (
        <div>
          <i
            className="fas fa-regular fa-arrow-left pt-6 ps-2 cursor-pointer"
            onClick={() => {
              routeChange("/");
            }}
          ></i>
          <NoOrders title="orders yet" />
        </div>
      )}
    </>
  );
};

export default Order;
