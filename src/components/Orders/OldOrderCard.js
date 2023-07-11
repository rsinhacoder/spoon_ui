import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Routes from "../../routes/route";
import checkIcon from "../../assets/images/check-icon.svg";
import { addQuantity, formatTime } from "../../helperFunctions/cartFunctions";
import { CartContext } from "../../context/CartContext";

const OldOrderCard = ({ pastOrders, userDetail }) => {
  const [date, setDate] = useState("");
  const { routeChange } = Routes();
  const { cart, setCart } = useContext(CartContext);
  useEffect(() => {
    setDate(new Date(pastOrders.updatedAt));
  }, []);

  const addOrder = () => {
    pastOrders.orderItems.forEach((element) => {
      addQuantity(cart, setCart, element, 0);
    });
    routeChange("/cart");
  };

  return (
    <div className=" bg-[#ffffff] rounded">
      <div className="flex gap-3 ms-2 items-center pt-3">
        <img src={checkIcon} alt="Check-icon" />
        <p className="text-[#444A61] font-semibold text-xs">
          Delivered on <span>{date.toString().substring(4, 15)}</span> at{" "}
          <span>{date ? [formatTime(date)] : ""}</span>
        </p>
      </div>
      <>
        {pastOrders.orderItems.map((data, index) => {
          return (
            <div className="" key={index}>
              <div className="shadow-[0px_4.84507px_30.2817px_rgba(89,79,75,0.1)] flex  rounded-xl mt-2 gap-5 text-start pastOrderList mx-2 py-2 ">
                <div className="w-[35%] h-[6rem] my-2 ms-2 md:w-1/5">
                  <img
                    src={data.itemImageURL}
                    alt={`${data.itemName} image`}
                    className="h-[6rem] w-[17rem] rounded-lg"
                  />
                </div>
                <div className="my-2  flex flex-col gap-1 w-[75%] min-[768px]:mt-2 ">
                  <p className="font-semibold text-sm md:text-base">
                    {data.itemName}
                  </p>
                  <p className="font-medium text-xs text-[#25CA80] md:text-sm">
                    {data.quantity} Plate
                  </p>
                  <p className="font-semibold text-xs md:text-sm">
                    ₹{data.price}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </>
      <div className=" flex mb-2 gap-5 text-start pastOrderList py-2 bg-[#f6f6f6]  ">
        <Link
          to={`/ordersdetails/oldorder/${pastOrders._id}/${userDetail._id}`}
          className="text-[#EB722C] font-semibold text-[12px] w-full  underlineflex mx-4 mt-1 cursor-pointer "
        >
          View Details
        </Link>
        <button
          className=" py-2 me-4  px-4 rounded-full bg-[#25CA80] text-white font-semibold text-xs cursor-pointer "
          onClick={() => {
            addOrder();
          }}
        >
          REORDER
        </button>
      </div>
    </div>
  );
};

export default OldOrderCard;
