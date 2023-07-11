import React, { useState } from "react";
import {
  addQuantity,
  deleteQuantity,
} from "../../helperFunctions/cartFunctions";
import Swal from "sweetalert2";
import "../../../src/App.scss";

const ItemQuantity = ({
  cart,
  setCart,
  cartData,
  categoryData,
  setCheckItem,
  setAddDish,
  setLimit,
}) => {
  const [check, setCheck] = useState(false);
  const increaseQuantity = () => {
    if (categoryData && cartData.quantity >= categoryData.item.limit) {
      cartData.quantity = categoryData.item.limit;
      if (setLimit) {
        setLimit(true);
        setTimeout(() => {
          setLimit(false);
        }, 1500);
      } else {
        setCheck(true);
        setTimeout(() => {
          setCheck(false);
        }, 2000);
      }
    } else {
      addQuantity(cart, setCart, cartData, 1);
    }
  };

  const decreaseQuantity = () => {
    if (cartData.quantity === 1) {
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
          if (setCheckItem && setAddDish) {
            setCheckItem(false);
            setAddDish(false);
          }
          deleteQuantity(cart, setCart, cartData);
          Swal.fire("Item removed!", "", "success");
        } else if (result.dismiss) {
          return;
        }
      });
    } else {
      deleteQuantity(cart, setCart, cartData);
    }
  };

  if (check && !setLimit) {
    return (
      <span className="text-md py-3 px-2 text-[#25ca80]">
        Item limit reached
      </span>
    );
  }

  return (
    <div className="border-2 border-[#25CA80] text-[#25CA80] rounded-lg px-1 py-[0.1rem] font-light">
      <i
        className="fas fa-regular fa-minus ps-2 cursor-pointer"
        onClick={() => {
          decreaseQuantity();
        }}
      ></i>
      <span className="px-1">{cartData?.quantity ? cartData.quantity : 0}</span>
      <i
        className="fas fa-regular fa-plus pe-2 cursor-pointer"
        onClick={() => {
          increaseQuantity();
        }}
      ></i>
    </div>
  );
};

export default ItemQuantity;
