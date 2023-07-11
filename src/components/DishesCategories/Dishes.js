import React, { useEffect, useState } from "react";
import defaultFoodImage from "../../assets/images/default-food-image.png";
import AboutDish from "./AboutDish";
import { socket } from "../../config/socketConnection";

const Dishes = ({ categoryData, setScrollBehaviour, setAddDish }) => {
  const [about, setAbout] = useState(false);
  const [instock, setInstock] = useState();
  useEffect(() => {
    socket.on("itemAvailability", (data) => {
      if (categoryData._id.toString() === data.id.toString()) {
        setInstock(data.availability);
      }
    });
  }, [socket]);

  useEffect(() => {
    setInstock(categoryData.availability);
  }, [categoryData]);

  return (
    <>
      <div
        className="dishes mx-2 my-2 rounded-xl cursor-pointer shadow-[0_25px_25px_-10px_rgba(0,0,0,0.3)] flex flex-col w-100 sm:min-h-[260px] sm:max-h-[260px] max-h-[200px] min-h-[200px]"
        onClick={() => {
          setScrollBehaviour(true);
          setAbout(!about);
          setAddDish(false);
        }}
      >
        <img
          src={
            categoryData.item
              ? categoryData.item.imageURL
                ? `${categoryData.item.imageURL}`
                : defaultFoodImage
              : ""
          }
          alt="dishImage"
          className={`rounded-t-xl sm:min-h-[160px] sm:max-h-[160px] min-h-[100px] max-h-[100px] ${
            instock ? "" : "grayscale"
          }`}
        />
        <div className="flex my-1 justify-around items-start ">
          <div className="my-2 ms-2 sm:w-[8rem] w-[4rem]">
            <p className="text-[#415161] text-ellipsis overflow-hidden sm:text-base text-sm">
              {categoryData.item ? categoryData.item.itemName : "itemName"}
            </p>
            <p className="text-[#092C4C] font-semibold sm:text-base text-sm">
              ₹{categoryData.item ? categoryData.item.price : "itemPrice"}
            </p>
          </div>
          {instock ? (
            <div
              className="rounded-md bg-[#25CA80] text-white p-1 mt-2 flex items-center"
              onClick={() => {
                setAddDish(true);
              }}
            >
              {instock ? (
                <>
                  <i className="fas fa-regular fa-plus sm:text-sm text-xs"></i>
                  <p className="sm:text-sm text-xs">Add</p>
                </>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div
              onClick={() => {
                setAddDish(true);
              }}
            >
              {instock ? (
                <>
                  <i className="fas fa-regular fa-plus sm:text-sm text-xs"></i>
                  <p className="sm:text-sm text-xs">Add</p>
                </>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
      {about ? (
        <AboutDish
          setScrollBehaviour={setScrollBehaviour}
          setAbout={setAbout}
          setAddDish={setAddDish}
          categoryData={categoryData}
          availability={instock}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Dishes;
