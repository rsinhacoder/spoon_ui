import React from "react";
import orderPlaceIcon from "../../assets/images/orderPlaced.svg";
import "../../App.scss";
import congratulations from "../../assets/congratulations.gif";

const OrderConfirm = ({ setOrderConfirm }) => {
  return (
    <div
      className="h-[100vh] fixed top-0 w-full blur-background flex flex-col justify-center items-center"
      onClick={() => {
        setOrderConfirm(false);
      }}
    >
      <div className="order-placed-effect rounded-3xl relative bg-white  p-3 flex flex-col justify-center items-center gap-8 pt-8 px-7">
        <img
          src={congratulations}
          alt="order-placed"
          className="absolute w-full"
        />
        <img src={orderPlaceIcon} alt="order-icon" />
        <p className="font-semibold text-2xl text-[#594F4B]">
          Congratulations!
        </p>
        <p className="font-normal text-xs text-[#594F4B] mb-5">
          Your order has been successfully placed
        </p>
      </div>
    </div>
  );
};

export default OrderConfirm;
