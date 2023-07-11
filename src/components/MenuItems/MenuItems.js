import React, { useEffect, useState } from "react";
import breakfast from "../../assets/images/breakfast.svg";
import Routes from "../../routes/route";
import { socket } from "../../config/socketConnection";

const MenuItems = ({ categories }) => {
  const [instock, setInstock] = useState();
  const { routeChange } = Routes();
  const changePath = (type) => {
    if (instock) {
      routeChange(`/category/${type}`);
    } else {
      setInstock(false);
    }
  };

  useEffect(() => {
    socket.on("categoryAvailability", (data) => {
      if (data.type === categories.categoryName) {
        setInstock(data.availability);
      }
    });

    socket.on("resturantAvailability", (data) => {
      setInstock(data.availability);
    });
  }, [socket]);

  useEffect(() => {
    setInstock(categories.availability);
  }, [categories]);

  return (
    <div
      className="hover:shadow-[0_15px_20px_-15px_rgba(0,0,0,0.3)] menuItems bg-[#F6F4F3] w-[8rem] 2xl:w-[12rem] rounded-lg flex justify-center flex-col items-center hover:border-[#EB722C] border-2 border-[#F6F4F3] px-4 py-2 my-4 me-3 cursor-pointer"
      onClick={() => {
        changePath(categories.categoryName);
      }}
    >
      <img
        src={categories.imageURL ? `${categories.imageURL}` : breakfast}
        alt="menuImage"
        className={`min-w-[70px] max-w-[70px] md:min-w-[90px] md:max-w-[90px] 2xl:w-[8rem] ${
          instock ? "" : "grayscale"
        }`}
      />
      <p className="font-semibold text-sm text-[#3F414F] 2xl:text-base">
        {categories.categoryName ? categories.categoryName : "categoryName"}
      </p>
    </div>
  );
};

export default MenuItems;
