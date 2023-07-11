import React from "react";

const BillDetails = ({ billItems }) => {
  return (
    <div className="flex justify-between mx-2 my-4 text-[#444A61] font-medium text-xs">
      <span className="flex">
        <i className="fas fa-sharp text-[#25CA80] fa-regular fa-circle me-2 m-[3px]"></i>
        <p>
          {billItems.itemName} <span>x</span> <span>{billItems.quantity}</span>
        </p>
      </span>
      <span>₹{billItems.price}</span>
    </div>
  );
};

export default BillDetails;
