import React from "react";
import NoOrder from "../../assets/images/noOrder.png";

const NoOrders = ({ title }) => {
  return (
    <div className=" h-full text-center md:flex flex-col md:justify-center md:items-center ">
      <img
        src={NoOrder}
        alt="NoOrder"
        className="h-[30vh] w-full md:w-[50vw] mt-3"
      />
      <p className="text-[#2f353f] font-bold mt-4">NO ORDER FOUND</p>
      <p className="text-[#b2a395] font-medium text-base px-2">
        Looks Like You dont have any {title} !
      </p>
    </div>
  );
};

export default NoOrders;
