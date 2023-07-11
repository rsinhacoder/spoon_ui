import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { getItemDetails } from "../../fetchAndPostDatas/fetchData";
import { removeItems } from "../../helperFunctions/cartFunctions";
import Loading from "../Loading/Loading";
import ItemQuantity from "./ItemQuantity";
import { socket } from "../../config/socketConnection";
import Swal from "sweetalert2";

const CartItem = ({ cartData, foodItems }) => {
  const cartDataId = cartData._id ? cartData._id : cartData.itemId;
  const [currentAvailibilityStatus, setCurrentAvailibilityStatus] =
    useState(null);
  const { cart, setCart } = useContext(CartContext);
  const [limit, setLimit] = useState(false);
  const [item, setItem] = useState();

  const remove = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item!",
      icon: "warning",
      showCancelButton: true,
      width: 300,
      heightAuto: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.isConfirmed) {
        getCurrentItemDetails();
        removeItems(cart, setCart, cartDataId, "cartData");
        Swal.fire("Item removed!", "", "success");
      } else if (result.dismiss) {
        return;
      }
    });
  };

  const getCurrentItemDetails = async () => {
    try {
      const response = await getItemDetails(cartDataId).then((response) => {
        return response.data.availability;
      });
      setCurrentAvailibilityStatus(response);
    } catch (error) {
      setCurrentAvailibilityStatus(false);
    }
  };

  useEffect(() => {
    getCurrentItemDetails();
  }, [cart]);

  useEffect(() => {
    socket.on("itemAvailability", (data) => {
      if (cartDataId.toString() === data.id.toString()) {
        getCurrentItemDetails();
      }
    });
  }, [socket]);

  useEffect(() => {
    getCurrentItemDetails();
  }, []);

  useEffect(() => {
    const res = foodItems.find((items) => items._id === cartDataId);
    if (res) {
      if (cartData.quantity >= res.item.limit) {
        cartData.quantity = res.item.limit;
      }
      setItem(res);
    }
  }, [cartDataId, foodItems, cartData]);

  return (
    <>
      <div
        className={`shadow-[0px_4.84507px_30.2817px_rgba(89,79,75,0.1)] border-2 mx-2 my-3 rounded-lg ${
          !currentAvailibilityStatus && "grayscale"
        }`}
      >
        <div className="flex justify-between mx-2 my-4">
          <p className="text-[#415161]">Item name</p>
          <p className="font-semibold">
            {cartData?.item
              ? cartData.item.itemName
                ? cartData.item.itemName
                : cartData?.itemName
              : cartData?.itemName}
          </p>
        </div>
        <div className="flex justify-between mx-2 my-4">
          <p className="text-[#415161]">Item quantity</p>
          <ItemQuantity
            cart={cart}
            setCart={setCart}
            cartData={cartData}
            categoryData={item && item}
            setLimit={setLimit}
          />
        </div>
        <div className="flex justify-between mx-2 my-4">
          <p className="text-[#415161]">Item Price</p>
          <p className="font-semibold">
            {cartData?.item
              ? cartData.item.price
                ? cartData.item.price
                : cartData?.price
              : cartData?.price}
          </p>
        </div>
        {limit && setLimit ? (
          <p className="text-[#EB722C] text-end me-2 mb-4">
            Item limit reached
          </p>
        ) : (
          <div
            className="flex gap-2 justify-end me-2 mb-4 cursor-pointer"
            onClick={() => {
              remove();
            }}
          >
            <p className="text-[#EB722C]">Remove item</p>
            <i className="fas fa-regular fa-trash-can mt-1 text-[#888E94]"></i>
          </div>
        )}
      </div>
    </>
  );
};

export default CartItem;
