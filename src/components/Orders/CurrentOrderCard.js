import React from "react";
import defaultFoodImage from "../../assets/images/default-food-image.png";

const CurrentOrdersCard = ({ orderItem }) => {
  return (
    <div className="h-[18vh] sm:h-[15vh] shadow-[0px_4.84507px_30.2817px_rgba(89,79,75,0.1)] bg-white flex mx-2 rounded-xl mt-5 gap-5 text-start">
      <div className="w-[10rem] my-2 ms-2">
        <img
          src={orderItem ? `${orderItem.itemImageURL}` : defaultFoodImage}
          alt={`${orderItem.itemName} image`}
          className="rounded-xl w-full h-full"
        />
      </div>
      <div className="my-2 me-2 flex flex-col gap-2 min-[425px]:gap-5 ">
        <p className="font-semibold text-sm md:text-base">
          {orderItem.itemName}
        </p>
        <p className="font-normal text-xs text-[#25CA80] md:text-sm">
          {orderItem.quantity}
          <span> Plate</span>
        </p>
        <p className="font-normal text-xs md:text-sm">
          Order will be delivered within an hour
        </p>
      </div>
    </div>
  );
};

export default CurrentOrdersCard;
