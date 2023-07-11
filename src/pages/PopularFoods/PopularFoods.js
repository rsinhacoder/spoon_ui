import React, { useContext, useEffect, useState } from "react";
import Routes from "../../routes/route";
import { getAllPopularFoodItems } from "../../fetchAndPostDatas/fetchData";
import Loading from "../../components/Loading/Loading";
import FoodItems from "../../components/FoodItems/FoodItems";
import { CartContext } from "../../context/CartContext";
import DishAdded from "../../components/DishesCategories/DishAdded";

const PopularFood = () => {
  const [allFoodItems, setAllFoodItems] = useState([]);
  const { wishlist, setWishList } = useContext(CartContext);
  const [scrollBehaviour, setScrollBehaviour] = useState(false);
  const [addDish, setAddDish] = useState(false);

  const { routeChange } = Routes();

  const popularFood = () => {
      getAllPopularFoodItems().then((res) => {
        setAllFoodItems(res.data);
      });
  };

  useEffect(() => {
    popularFood();
  }, []);

  useEffect(() => {
    if (scrollBehaviour) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [scrollBehaviour]);

  if (allFoodItems.length === 0) {
    return <Loading />;
  } else {
    return (
      <div className="mb-6">
        <i
          className="fas fa-regular fa-arrow-left cursor-pointer pt-6 ps-2"
          onClick={() => {
            routeChange("/");
          }}
        ></i>
        <p className="ps-2 pt-3 font-semibold text-xl text-[#090A16]">
          Popular Food
        </p>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {allFoodItems &&
            allFoodItems.map((data, index) => (
              <FoodItems
                setAddDish={setAddDish}
                setScrollBehaviour={setScrollBehaviour}
                popularFoodItems={data}
                key={index}
                wishlist={wishlist}
                setWishList={setWishList}
              />
            ))}
        </div>
        {addDish && <DishAdded />}
      </div>
    );
  }
};

export default PopularFood;
