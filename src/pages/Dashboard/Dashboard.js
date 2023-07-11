import React, { useEffect, useState } from "react";
import location from "../../assets/images/location.svg";
import { GlobalContext } from "../../context/GlobalContext";
import { useContext } from "react";
import MenuItems from "../../components/MenuItems/MenuItems";
import FoodItems from "../../components/FoodItems/FoodItems";
import Routes from "../../routes/route";
import {
  getAllCategories,
  getAllPopularFoodItems,
  getAllFoodItems,
  getResturantStatus,
} from "../../fetchAndPostDatas/fetchData";
import NavPopup from "../../components/NavPopup/NavPopup";
import ClearIcon from "@mui/icons-material/Clear";
import "./Dashboard.scss";
import default_dp from "../../assets/images/default_dp.png";
import Navbar from "../../components/Navbar/Navbar";
import DropDown from "../../components/DropDown/DropDown";
import Loading from "../../components/Loading/Loading";
import Cookies from "js-cookie";
import { geoloc } from "../../helperFunctions/geoLocation";
import { CartContext } from "../../context/CartContext";
import DishAdded from "../../components/DishesCategories/DishAdded";
import WrongSearchImage from "../../assets/wrong-search-food-image.jpeg";
import SearchingImage from "../../assets/searching-image.gif";
import StaticSearch from "../../assets/static-searching-image.png";
import { decryptDatas } from "../../helperFunctions/encryptData";
import { socket } from "../../config/socketConnection";
import OrderIcon from "../../assets/ordersIcon.gif";
import Swal from "sweetalert2";

const Dashboard = () => {
  const searchBox = document.querySelector(".searchBox");
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [categories, setCategories] = useState([]);
  const [navPopup, setNavPopup] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [popularFoodItems, setPopularFoodItems] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [displayItems, setDisplayItems] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const { wishlist, setWishList } = useContext(CartContext);
  const [restaurantStatus, setRestaurantStatus] = useState(true);
  const [scrollBehaviour, setScrollBehaviour] = useState(false);
  const [addDish, setAddDish] = useState(false);
  const [previousSearch, setPreviousSearch] = useState("");
  const { cart, setCart } = useContext(CartContext);

  const options = [
    { label: "Current location", value: "CurrentLocation" },
    { label: "Home", value: "Home" },
  ];

  const SearchBtn = () => {
    searchBox.classList.add("active");
    searchBox.style.borderRadius = "10px";
  };

  const CloseBtn = () => {
    searchBox.classList.remove("active");
    searchBox.style.borderRadius = "100%";
    setInputQuery("");
    setFilteredItems([]);
    setDisplayItems(false);
  };

  const changeAddress = (e) => {
    if (e.target.value === "Home") {
      if (!userDetails?._id) {
        Swal.fire({
          icon: "warning",
          text: "Please Log-in",
          timer: 1000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          routeChange("/sign-in");
        }, 1000);
      }
      if (userDetails?._id) {
        if (!userDetails.address) {
          Swal.fire({
            icon: "warning",
            text: "Please update your address",
            timer: 1000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            routeChange("/profile");
          }, 1000);
        }
        setUserAddress(userDetails.address);
      }
    } else {
      geoloc(setUserAddress);
    }
  };

  const { routeChange } = Routes();

  const handleChange = () => {
    if (inputQuery !== "") {
      setPreviousSearch(inputQuery);
      setDisplayItems(true);
      if (popularFoodItems) {
        setFilteredItems(filterData(inputQuery.toLowerCase()));
      }
    } else {
      setDisplayItems(false);
    }
  };

  const filterData = (e) => {
    const filteredData = foodItems.filter((data) => {
      if (e === "") {
        return data;
      } else {
        if (data.item.itemName.toLowerCase().includes(e)) {
          return data;
        } else {
          return "";
        }
      }
    });
    return filteredData;
  };

  useEffect(() => {
    if (inputQuery.length === 0) {
      setDisplayItems(false);
    }
  }, [inputQuery]);

  const category = () => {
    getAllCategories().then((response) => {
      setCategories(response.data);
    });
  };

  const popularFood = () => {
    getAllPopularFoodItems().then((res) => {
      setPopularFoodItems(res.data);
    });
  };

  const handleNavPopup = () => {
    if (navPopup === true) {
      setNavPopup(false);
    }
  };

  const allFoodItems = () => {
    getAllFoodItems().then((res) => {
      setFoodItems(res.data);
    });
  };

  useEffect(() => {
    category();
    popularFood();
    allFoodItems();
    if (navigator.geolocation) {
      geoloc(setUserAddress);
    } else {
      console.log("Browser doesn't support geo location");
    }
  }, []);

  useEffect(() => {
    if (Cookies.get("token")) {
      setUserDetails(decryptDatas("userData"));
    }
  }, []);

  useEffect(() => {
    getResturantStatus().then((res) => {
      if (res.success) {
        setRestaurantStatus(res.data.isOpen);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("resturantAvailability", (data) => {
      setRestaurantStatus(data.availability);
      allFoodItems();
      category();
    });
  });

  useEffect(() => {
    if (scrollBehaviour) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [scrollBehaviour]);

  useEffect(() => {
    if (cart.length === 0) {
      if (localStorage.getItem("cartData") !== null) {
        setCart(JSON.parse(localStorage.getItem("cartData")));
      }
    } else {
      localStorage.setItem("cartData", JSON.stringify(cart));
    }
  }, [cart, setCart]);

  if (!categories.length > 0 || !popularFoodItems) {
    return <Loading />;
  } else {
    return (
      <div>
        <div className="mx-5 mb-20 lg:mb-2 sm:mx-10" onClick={handleNavPopup}>
          <nav className="mt-3 lg:sticky lg:top-0 lg:z-30 lg:bg-white lg:w-full">
            <div className="flex items-center justify-between">
              <div className="flex md:items-center items-start min-h-[70px] max-h-[70px] flex-col md:flex-row gap-2 md:gap-4">
                <div className="flex items-center">
                  <img src={location} className="w-6 h-6" alt="location-icon" />
                  <DropDown options={options} onChange={changeAddress} />
                </div>
                <div className="text-xs text-[#757575] md:text-base overflow-auto ms-7">
                  {userAddress ? (
                    userAddress
                  ) : (
                    <div className="flex items-center justify-center">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center my-3 sm:justify-center ">
                <div className="flex absolute left-5 md:left-11 top-24 lg:justify-between lg:static cursor-pointer">
                  <div className="searchBox rounded-full ">
                    <div className="search" onClick={SearchBtn}>
                      <i
                        className="fas far fa-search pe-6 text-[#757575]"
                        name="search"
                      ></i>
                    </div>
                    <div className="searchInput">
                      <input
                        type="text"
                        value={inputQuery}
                        placeholder="Search"
                        onChange={(e) => {
                          setFilteredItems([]);
                          setInputQuery(e.target.value);
                        }}
                        className="text-center text-xs md:text-base"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleChange();
                          }
                        }}
                      />
                    </div>
                    <div className="close" onClick={CloseBtn}>
                      <ClearIcon name="close" />
                    </div>
                  </div>
                  <button
                    className="rounded-3xl bg-[#25CA80] ms-3 me-5 md:me-1 text-white sm:px-5 px-3 py-2 fw-bold sm:py-1"
                    onClick={handleChange}
                  >
                    SEARCH
                  </button>
                </div>
                <img
                  src={
                    userDetails
                      ? userDetails.imageURL
                        ? `${userDetails.imageURL}`
                        : default_dp
                      : default_dp
                  }
                  className="rounded-full min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] md:min-w-[60px] md:max-w-[60px] md:min-h-[60px] md:max-h-[60px] p-1 cursor-pointer"
                  alt="user"
                  onClick={
                    navPopup
                      ? () => {
                          setNavPopup(false);
                        }
                      : () => {
                          setNavPopup(true);
                        }
                  }
                />
                {navPopup ? <NavPopup setNavPopup={setNavPopup} /> : ""}
              </div>
            </div>
          </nav>
          <div className="mt-16 lg:mt-2">
            {restaurantStatus ? (
              <>
                <p className="text-[#090A16] font-semibold text-xl my-1 py-2">
                  Select By Category
                </p>
                <div className="flex w-full overflow-y-scroll">
                  {categories &&
                    categories.map((item, index) => (
                      <MenuItems categories={item} key={index} />
                    ))}
                </div>
              </>
            ) : (
              <div className="h-[10vh] gap-6 w-full backdrop-blur z-10 flex justify-center items-center flex-col">
                <p className="text-xl font-bold">Restaurant is closed now!!</p>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl text-[#090A16] my-3">
                {displayItems
                  ? filteredItems && filteredItems.length > 0
                    ? "Searched Items"
                    : ""
                  : "Popular Foods"}
              </p>
              <p
                className="text-[#25CA80] cursor-pointer"
                onClick={() => {
                  routeChange("/popularfoods");
                }}
              >
                {displayItems
                  ? ""
                  : !popularFoodItems.length > 0 || !restaurantStatus
                  ? ""
                  : "View All"}
              </p>
            </div>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-2">
              {displayItems ? (
                filteredItems && filteredItems.length > 0 ? (
                  filteredItems &&
                  filteredItems.map((item, index) => (
                    <FoodItems
                      setAddDish={setAddDish}
                      setScrollBehaviour={setScrollBehaviour}
                      popularFoodItems={item}
                      key={index}
                      wishlist={wishlist}
                      setWishList={setWishList}
                    />
                  ))
                ) : (
                  <div className="w-full col-span-2 md:col-span-4 flex flex-col items-center">
                    {inputQuery !== "" ? (
                      previousSearch !== inputQuery ? (
                        <p>
                          For <b>{inputQuery}</b>. Click{" "}
                          <span className="text-teal-600">'Search'</span>
                        </p>
                      ) : (
                        <p>
                          We dont have <b>{inputQuery}</b> available
                        </p>
                      )
                    ) : (
                      <p>Enter a food item please.</p>
                    )}
                    <img
                      className="w-[200px] h-[200px]"
                      src={
                        inputQuery !== ""
                          ? previousSearch !== inputQuery
                            ? SearchingImage
                            : WrongSearchImage
                          : StaticSearch
                      }
                      alt="No-Such-Food"
                    />
                  </div>
                )
              ) : !popularFoodItems.length > 0 ? (
                foodItems &&
                foodItems.map((item, index) => (
                  <FoodItems
                    setAddDish={setAddDish}
                    setScrollBehaviour={setScrollBehaviour}
                    popularFoodItems={item}
                    key={index}
                    wishlist={wishlist}
                    setWishList={setWishList}
                  />
                ))
              ) : (
                popularFoodItems &&
                popularFoodItems.map((item, index) =>
                  index < 10 ? (
                    <FoodItems
                      setAddDish={setAddDish}
                      setScrollBehaviour={setScrollBehaviour}
                      popularFoodItems={item}
                      key={index}
                      wishlist={wishlist}
                      setWishList={setWishList}
                    />
                  ) : (
                    ""
                  )
                )
              )}
            </div>
          </div>
          <img
            className="w-[58px] h-[60px] md:w-[80px] flex ml-0 justify-center fixed bottom-20 lg:bottom-10 border-2 backdrop-blur rounded-full cursor-pointer"
            src={OrderIcon}
            alt="order-icon"
            onClick={() => {
              routeChange("/order");
            }}
          />
        </div>
        {addDish && <DishAdded />}
        <Navbar />
      </div>
    );
  }
};

export default Dashboard;
