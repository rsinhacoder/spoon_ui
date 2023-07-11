import React, { useEffect, useContext, useState } from "react";
import FoodItems from "../FoodItems/FoodItems";
import Loading from "../Loading/Loading";
import { CartContext } from "../../context/CartContext";
import { getItemDetails } from "../../fetchAndPostDatas/fetchData";
import NoItem from "../NoItem/NoItem";

const WishlistItem = ({ setAddDish }) => {
  const { wishlist, setWishList } = useContext(CartContext);
  const [itemsUpdateDetails, setItemsUpdateDetails] = useState([]);
  const [items, setItems] = useState([]);
  const [scrollBehaviour, setScrollBehaviour] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("wishListItems") !== null) {
      setItems(JSON.parse(localStorage.getItem("wishListItems")));
    }
  }, []);

  useEffect(() => {
    if (items.length) {
      items.forEach((each) => {
        getItemDetails(each._id).then((response) => {
          setItemsUpdateDetails((wishlist) => [...wishlist, response.data]);
        });
      });
    }
  }, [items]);

  useEffect(() => {
    if (items.length === itemsUpdateDetails.length) {
      setWishList(itemsUpdateDetails);
    }
  }, [itemsUpdateDetails]);

  useEffect(() => {
    if (scrollBehaviour) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [scrollBehaviour]);

  if (!wishlist.length > 0) {
    return localStorage.getItem("wishListItems")?.length > 0 ? (
      <Loading />
    ) : (
      <NoItem />
    );
  }

  return (
    <div className="mx-5 mb-16 lg:mb-2 sm:mx-10">
      <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-2">
        {wishlist &&
          wishlist.map((item, index) => (
            <FoodItems
              setAddDish={setAddDish}
              setScrollBehaviour={setScrollBehaviour}
              popularFoodItems={item}
              key={index}
              wishlist={wishlist}
              setWishList={setWishList}
            />
          ))}
      </div>
    </div>
  );
};

export default WishlistItem;
