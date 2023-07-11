import React, { useEffect, useState } from "react";
import BillDetails from "./BillDetails";
import Routes from "../../routes/route";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../fetchAndPostDatas/fetchData";
import Loading from "../Loading/Loading";

const OrderDetails = () => {
  const userData = useParams();
  const [orderDetails, setOrderDetails] = useState();

  const { routeChange } = Routes();
  useEffect(() => {
    getOrderById(userData.id).then((res) => {
      setOrderDetails(res.data);
    });
  }, [userData]);

  const changeRoute = () => {
    if (userData.type === "current") {
      routeChange(`/currentorderspage/${userData.id}/${userData.userId}`);
    } else {
      routeChange("/oldorders");
    }
  };

  if (orderDetails) {
    return (
      <div>
        <div className="flex mb-4">
          <i
            className="fas fa-regular fa-arrow-left pt-6 ps-2 cursor-pointer"
            onClick={changeRoute}
          ></i>
          <p className="text-[#092C4C] mt-5 ms-2 font-semibold text-sm">
            ORDER #
            <span>{orderDetails ? orderDetails._id : "11948481486"}</span>
          </p>
        </div>
        <hr />
        <div className="flex ms-2 my-4">
          <i className="fas fa-light text-[#EB722C] fa-house"></i>
          <div className="text-[#444A61] ms-2">
            <p className="font-semibold text-[13px]">Address:</p>
            <p className="text-xs font-normal">
              {orderDetails
                ? orderDetails.address
                : "4/28, Shailesh IndiEstate, Navghar, Vasai, Mumbai"}
            </p>
          </div>
        </div>
        <hr className="mx-2" />
        <div className="flex ms-2 my-4">
          <i className="fas fa-light text-[#EB722C] fa-circle-check"></i>
          <p className="text-xs text-[#444A61] ms-2 font-normal">
            {userData.type === "current" ? "Delivery on" : "Delivered on"}{" "}
            <span>{orderDetails.date.toString().substring(0, 7)}</span>{" "}
            {userData.type === "current"
              ? ""
              : `, ${orderDetails.orderCompleteTime}`}
          </p>
        </div>
        <div className="bg-[#F6F6F6] py-4 px-2">
          <p className="text-[#092C4C] font-semibold text-sm">Bill Details</p>
          <p className="text-[#888D92] text-xs font-medium">
            Total
            <span>
              {" "}
              {orderDetails?.orderItems
                ? orderDetails.orderItems.length
                : ""}{" "}
            </span>
            items
          </p>
        </div>
        {orderDetails?.orderItems
          ? orderDetails.orderItems.map((items, index) => (
              <BillDetails billItems={items} key={index} />
            ))
          : ""}
        <hr className="mx-2" />
        <div className="flex justify-between text-[#444A61] mx-2 mt-4 font-medium text-xs">
          <p>Item Total</p>
          <p>₹{orderDetails ? orderDetails.totalAmount - 16 : ""}</p>
        </div>
        <div className="flex justify-between text-[#444A61] mx-2 mt-3 mb-4 font-medium text-xs">
          <p>Tax & Charges</p>
          <p>₹16</p>
        </div>
        <hr className="mx-2" />
        <div className="flex justify-between text-[#444A61] mx-2 mt-4 font-semibold text-xs">
          <p>Grand Total</p>
          <p>₹{orderDetails ? orderDetails.totalAmount : ""}</p>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default OrderDetails;
