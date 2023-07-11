import React, { useEffect, useState } from "react";
import OldOrderCard from "../../components/Orders/OldOrderCard";
import Routes from "../../routes/route";
import { getAllPastOrders } from "../../fetchAndPostDatas/fetchData";
import Loading from "../../components/Loading/Loading";
import Cookies from "js-cookie";
import { decryptDatas } from "../../helperFunctions/encryptData";

const OldOrders = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const [showMoreOrder, setShowMoreOrder] = useState(false);
  const userDetail = decryptDatas("userData");
  const { routeChange } = Routes();

  useEffect(() => {
    if (!Cookies.get("token")) {
      return routeChange("/");
    }
    if (userDetail) {
      getAllPastOrders(userDetail._id).then((response) => {
        setPastOrders(response.data);
      });
    }
  }, []);

  if (pastOrders.length > 0) {
    return (
      <div className="bg-[#F6F6F6] h-[100vh] ">
        <div className=" ">
          <i
            className="fas fa-regular fa-arrow-left cursor-pointer pt-6 ps-2"
            onClick={() => {
              routeChange("/order");
            }}
          ></i>
          <p className="mt-2 ps-2 font-semibold text-[#090A16] text-lg mb-4 ">
            Past Orders
          </p>
        </div>

        {showMoreOrder ? (
          <div className="overflow-y-scroll h-[86.7vh]">
            {pastOrders.map((data, index) => {
              return (
                <OldOrderCard
                  pastOrders={data}
                  key={index}
                  userDetail={userDetail}
                />
              );
            })}
          </div>
        ) : (
          <>
            {pastOrders.map((data, index) => {
              if (index < 2) {
                return (
                  <OldOrderCard
                    pastOrders={data}
                    key={index}
                    userDetail={userDetail}
                  />
                );
              }
            })}
            {pastOrders.length > 2 && (
              <p
                className="text-[#092C4C] font-medium ms-2 p-2  text-sm cursor-pointer "
                onClick={() => setShowMoreOrder(!showMoreOrder)}
              >
                VIEW MORE ORDERS
              </p>
            )}
          </>
        )}
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default OldOrders;
