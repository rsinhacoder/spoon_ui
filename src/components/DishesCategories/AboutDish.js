import React, { useContext, useEffect, useRef, useState } from "react";
import defaultFoodImage from "../../assets/images/default-food-image.png";
import "../../App.scss";
import { CartContext } from "../../context/CartContext";
import { addQuantity } from "../../helperFunctions/cartFunctions";
import ItemQuantity from "../CartItem/ItemQuantity";

const AboutDish = ({
  setAbout,
  setAddDish,
  categoryData,
  setScrollBehaviour,
  availability,
}) => {
  const instock = availability;
  const { cart, setCart } = useContext(CartContext);
  const [checkItem, setCheckItem] = useState(false);
  const ref = useRef();

  const addCart = () => {
    setCheckItem(true);
    setAddDish(true);
    setAbout(false);
    setScrollBehaviour(false);
    addQuantity(cart, setCart, categoryData, 1);
  };

  useEffect(() => {
    if (localStorage.getItem("cartData") !== null) {
      cart.find((cartItem) => {
        if (
          (cartItem._id ? cartItem._id : cartItem.itemId) === categoryData._id
        ) {
          setCheckItem(true);
          if (cartItem.quantity >= categoryData.item.limit) {
            cartItem.quantity = categoryData.item.limit;
          }
          return cartItem;
        }
        return "";
      });
      if (cart.length > 0) {
        localStorage.setItem("cartData", JSON.stringify(cart));
      } else {
        setCart(JSON.parse(localStorage.getItem("cartData")));
      }
    }
  }, [cart]);

  function hideonClick(e) {
    if (ref.current && !ref.current.contains(e.target)) {
      setAbout(false);
      setScrollBehaviour(false);
    }
  }

  return (
    <div
      className="h-[100vh] fixed top-0 right-0 w-full blur-background z-50 "
      onClick={(e) => {
        hideonClick(e);
      }}
    >
      <div
        className="about-dish-animation  w-full flex flex-col rounded-xl absolute sm:w-2/5 lg:w-1/3 xl:w-1/4 bottom-0 sm:bottom-[20%] left-0 sm:left-[30%] lg:left-[33%] xl:left-[37%] bg-white bg-opacity-30"
        ref={ref}
      >
        <span className="rounded-full bg-white absolute right-5 top-5 cursor-pointer z-10">
          <i
            className="fas fa-regular fa-xmark px-2 py-1.5"
            onClick={() => {
              setScrollBehaviour(false);
              setAbout(false);
            }}
          ></i>
        </span>

        <img
          src={
            categoryData.item.imageURL
              ? `${categoryData.item.imageURL}`
              : defaultFoodImage
          }
          alt="dishImage"
          className={`rounded-t-xl w-full h-[30vh] ${
            instock ? "" : "grayscale"
          }`}
        />
        <div className="px-2 bg-white">
          <div className="flex mt-2">
            <div className="w-[1.5rem]">
              <span className="rounded-full bg-[#25CA80] px-[.6rem]"></span>
            </div>
            <p className="text-[#EB722C] text-base">
              {categoryData.item.category
                ? categoryData.item.category
                : "categoryName"}
            </p>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="my-2">
              <p className="font-semibold text-sm">
                {categoryData.item.itemName
                  ? categoryData.item.itemName
                  : "categoryItemName"}
              </p>
              <p className="text-xs">
                ₹
                <span>
                  {categoryData.item.price
                    ? categoryData.item.price
                    : "categoryItemPrice"}
                </span>
              </p>
            </div>
            {instock ? (
              checkItem ? (
                cart.map((cartItem, index) =>
                  (cartItem._id ? cartItem._id : cartItem.itemId) ===
                  categoryData._id ? (
                    <ItemQuantity
                      cart={cart}
                      setCart={setCart}
                      cartData={cartItem}
                      categoryData={categoryData}
                      setCheckItem={setCheckItem}
                      setAddDish={setAddDish}
                      key={index}
                    />
                  ) : (
                    ""
                  )
                )
              ) : (
                <span
                  className="rounded-md bg-transparent shadow-[0_4.84507px_30.2817px_rgba(89,79,75,0.2)] text-xs py-3 px-2 text-[#25ca80] cursor-pointer"
                  onClick={() => {
                    addCart();
                  }}
                >
                  ADD
                  <i className="fas fa-regular fa-cart-shopping ps-4 text-black"></i>
                </span>
              )
            ) : (
              ""
            )}
          </div>
          <p className="mt-5 text-[#757575] text-xs overflow-scroll h-[110px]">
            {categoryData.item.description
              ? categoryData.item.description
              : "categoryItemDescription"}
          </p>
          <p className="mt-5 mb-10 text-xs">
            <span className={instock ? "text-[#25CA80]" : "text-[#EB722C]"}>
              {instock ? "Item available" : "Currently unavailable"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutDish;
