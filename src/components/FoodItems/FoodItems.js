import React, { useState, useContext, useEffect } from "react";
import veg from "../../assets/images/veg.svg";
import like from "../../assets/images/like.svg";
import terrier from "../../assets/images/terrier.svg";
import liked from "../../assets/images/liked.svg";
import AboutDish from "../DishesCategories/AboutDish";
import { GlobalContext } from "../../context/GlobalContext";
import Routes from "../../routes/route";
import { addWishItems, removeItems } from "../../helperFunctions/cartFunctions";
import Cookies from "js-cookie";
import { decryptDatas } from "../../helperFunctions/encryptData";
import { socket } from "../../config/socketConnection";

const FoodItems = ({
  setAddDish,
  setScrollBehaviour,
  popularFoodItems,
  wishlist,
  setWishList,
}) => {
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [instock, setInstock] = useState();
  const [wishvalue, setWishValue] = useState(like);
  const [about, setAbout] = useState(false);
  const { routeChange } = Routes();
  const changeImage = () => {
    if (!userDetails?._id) {
      return routeChange("/sign-up");
    }
    if (wishvalue === liked) {
      setWishValue(like);
      removeItems(wishlist, setWishList, popularFoodItems._id, "wishListItems");
    } else {
      setWishValue(liked);
      addWishItems(wishlist, setWishList, popularFoodItems);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("wishListItems") !== null) {
      setWishList(JSON.parse(localStorage.getItem("wishListItems")));
    }
  }, []);

  useEffect(() => {
    setInstock(popularFoodItems.availability);
  }, [popularFoodItems]);

  useEffect(() => {
    if (wishlist.length > 0 && wishlist) {
      localStorage.setItem("wishListItems", JSON.stringify(wishlist));
      const res = wishlist.find((data) => data._id === popularFoodItems._id);
      if (res) {
        setWishValue(liked);
      } else {
        setWishValue(like);
      }
    }
  }, [wishlist, popularFoodItems]);

  useEffect(() => {
    if (Cookies.get("token")) {
      if (localStorage.getItem("userData") !== null) {
        setUserDetails(decryptDatas("userData"));
      }
    }
  }, []);

  useEffect(() => {
    socket.on("categoryAvailability", (data) => {
      if (data.type.toString() === popularFoodItems.item.category.toString()) {
        popularFoodItems.availability = data.availability;
        setInstock(data.availability);
      }
    });

    socket.on("itemAvailability", (data) => {
      if (popularFoodItems._id === data.id) {
        popularFoodItems.availability = data.availability;
        setInstock(data.availability);
      }
    });

    socket.on("resturantAvailability", (data) => {
      setInstock(data.availability);
    });
  }, [socket]);

  return (
    <>
      <div className="flex flex-col justify-between rounded-lg shadow-[0_15px_20px_-10px_rgba(0,0,0,0.3)] p-3 min-h-min border-b-2 border-gray-200 cursor-pointer">
        <div className="flex justify-end">
          <img src={wishvalue} alt="wishlist" onClick={changeImage} />
        </div>
        <div
          onClick={() => {
            setScrollBehaviour(true);
            setAbout(!about);
          }}
          className="flex flex-col items-center m-auto w-full"
        >
          <img
            src={
              popularFoodItems
                ? popularFoodItems.item
                  ? popularFoodItems.item.imageURL
                    ? popularFoodItems.item.imageURL
                    : terrier
                  : ""
                : ""
            }
            className={`w-[6rem] h-[6rem] rounded-full 2xl:w-[10rem] 2xl:h-[10rem] ${
              instock ? "" : "grayscale"
            } `}
            alt="terrier"
          />
          <p className="text-center mt-6 lg:text-base text-xs">
            {popularFoodItems
              ? popularFoodItems.item
                ? popularFoodItems.item.itemName
                  ? popularFoodItems.item.itemName
                  : ""
                : ""
              : ""}
          </p>
        </div>
      </div>
      {about ? (
        <AboutDish
          setScrollBehaviour={setScrollBehaviour}
          setAbout={setAbout}
          setAddDish={setAddDish}
          categoryData={popularFoodItems}
          availability={instock}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default FoodItems;
