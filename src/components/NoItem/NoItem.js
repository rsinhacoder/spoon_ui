import React from "react";
import NoItemImage from "../../assets/images/empty-plate.png";

const NoItem = () => {
  return (
    <div className="flex flex-col items-center gap-10 mt-20">
      <div className="w-3/5 lg:w-1/4 text-center">
        <img src={NoItemImage} alt="empty-plate" />
      </div>
      <div className="ms-5">Nothing here yet</div>
    </div>
  );
};

export default NoItem;
