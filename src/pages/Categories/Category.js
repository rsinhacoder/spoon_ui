import React, { useState, useEffect, useContext } from "react";
import categoryOffline from "../../assets/category-offline.gif";
import Navbar from "../../components/Navbar/Navbar";
import Dishes from "../../components/DishesCategories/Dishes";
import Route from "../../routes/route";
import {
  getAllItems,
  getSingleCategory,
} from "../../fetchAndPostDatas/fetchData";
import { useParams } from "react-router-dom";
import DropDown from "../../components/DropDown/DropDown";
import Loading from "../../components/Loading/Loading";
import "../../App.scss";
import { CartContext } from "../../context/CartContext";
import DishAdded from "../../components/DishesCategories/DishAdded";
import { socket } from "../../config/socketConnection";
import EmptyCategory from "../../assets/empty-category-image-5.png";
import DefaultEmptyCategoryImage from "../../assets/default-category-image.webp";

const Category = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [category, setCategory] = useState([]);
  const [displayCategoryData, setDisplayCategoryData] = useState([]);
  const { setCart } = useContext(CartContext);
  const [scrollBehaviour, setScrollBehaviour] = useState(false);
  const [addDish, setAddDish] = useState(false);

  const categoryType = useParams();
  const { routeChange } = Route();
  const options = [
    { label: "Sort by", value: 0 },
    { label: "Price low to high", value: 1 },
    { label: "Price high to low", value: 2 },
  ];

  const handleChange = (e) => {
    if (e.target.value === "0") {
      categoriesDataLoop(categoryData);
    } else if (e.target.value === "1") {
      categoriesDataLoop(
        categoryData.toSorted((a, b) => a.item.price - b.item.price)
      );
    } else if (e.target.value === "2") {
      categoriesDataLoop(
        categoryData.toSorted((a, b) => b.item.price - a.item.price)
      );
    }
  };

  const categoriesDataLoop = (items) => {
    if (items && items.length > 0) {
      const dishesData = items.map((data, index) => {
        return (
          <Dishes
            setScrollBehaviour={setScrollBehaviour}
            categoryData={data}
            key={index}
            setAddDish={setAddDish}
          />
        );
      });
      setDisplayCategoryData(dishesData);
      return dishesData;
    }
  };

  const getFoodAndCategoryData = () => {
    getSingleCategory(categoryType.type).then((res) => {
      if (res.success) {
        setCategory(res.data);
      }
    });
    getAllItems(categoryType.type).then((response) => {
      if (response.success) {
        setCategoryData(response.data);
        categoriesDataLoop(response.data);
      }
    });
  };

  useEffect(() => {
    socket.on("categoryAvailability", (data) => {
      if (data.type === categoryType.type) {
        getFoodAndCategoryData();
      }
    });

    socket.on("itemAvailability", (data) => {
      setCategoryData((category) =>
        category.map((item) =>
          item._id === data.id
            ? { ...item, availability: data.availability }
            : { ...item }
        )
      );
    });

    socket.on("resturantAvailability", (data) => {
      getFoodAndCategoryData();
    });
  }, [socket]);

  useEffect(() => {
    getFoodAndCategoryData();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("cartData") !== null) {
      setCart(JSON.parse(localStorage.getItem("cartData")));
    }
  }, [setCart]);

  useEffect(() => {
    if (scrollBehaviour) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [scrollBehaviour]);

  if (!categoryData) {
    return <Loading />;
  }

  if (!category.availability) {
    return (
      <>
        <i
          className="fas fa-regular fa-arrow-left cursor-pointer pt-6 ps-2"
          onClick={() => {
            routeChange("/");
          }}
        ></i>
        <div className="flex flex-col justify-center items-center">
          <p>Category is offline</p>
          <img src={categoryOffline} alt="offlineImage" />
        </div>
      </>
    );
  }

  if (categoryData.length === 0) {
    return (
      <div>
        <div className="flex gap-2 w-full border-b-2 border-dashed border-[#BBC1CB] backdrop-blur fixed">
          <i
            className="fas fa-regular fa-arrow-left cursor-pointer my-auto ps-2"
            onClick={() => {
              routeChange("/");
            }}
          ></i>
          <img
            src={category?.imageURL ? category.imageURL : DefaultEmptyCategoryImage}
            alt="menuImage"
            className="w-[4rem] 2xl:w-[10rem] rounded-full my-2"
          />
          <div className="flex-none pt-3 w-2/3">
            <p className="font-semibold text-base md:text-xl 2xl:text-2xl">
              {category?.categoryName}
            </p>
            <p className="text-xs md:text-base 2xl:text-lg text-black">
              "Satisfy your cravings, one bite at a time."
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-center text-2xl overflow-hidden absolute top-56 w-[170px] lg:w-max lg:top-80 lg:backdrop-blur">
            No <b>Food</b> available in this Category yet!
          </div>
          <img
            className="mx-auto h-[100vh] lg:w-full"
            src={EmptyCategory}
            alt="empty-category"
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative">
        <div className="flex gap-2 w-full border-b-2 border-dashed border-[#BBC1CB] backdrop-blur fixed">
          <i
            className="fas fa-regular fa-arrow-left cursor-pointer my-auto ps-2"
            onClick={() => {
              routeChange("/");
            }}
          ></i>
          <img
            src={
              category?.imageURL ? category.imageURL : DefaultEmptyCategoryImage
            }
            alt="menuImage"
            className="w-[6rem] 2xl:w-[10rem] p-2"
          />
          <div className="flex-none pt-3 w-2/3">
            <p className="font-semibold text-base md:text-xl 2xl:text-2xl">
              {category?.categoryName}
            </p>
            <p className="text-xs md:text-base 2xl:text-lg text-[#757575]">
              "Satisfy your cravings, one bite at a time."
            </p>
          </div>
        </div>
        <div className="flex pt-[6.5rem]">
          <div className="flex rounded-full border gap-1 mt-4 items-center ms-2 border-[#BBC1CB]">
            <DropDown options={options} onChange={handleChange} />
          </div>
        </div>
        <p className="mt-5 ms-3 font-semibold text-[#090A16]">
          <span>{categoryData && categoryData.length}</span> dish to explore
        </p>
        <div className="pb-12 mb-[2rem] mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 overflow-x-scroll">
          {displayCategoryData && displayCategoryData}
        </div>
        {addDish && <DishAdded />}
        <Navbar />
      </div>
    );
  }
};

export default Category;
