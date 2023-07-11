import React, { useRef, useEffect } from "react";
import CurrentOrdersCard from "./CurrentOrderCard";
import { Link } from "react-router-dom";

const CurrentOrders = ({ currentOrders, limit, path }) => {
  const newOrderRef = useRef(null);

  const scrollToTop = () => {
    newOrderRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="text-center" ref={newOrderRef}>
      {currentOrders?.orderItems?.map((orderItem, index) =>
        index < limit ? (
          <CurrentOrdersCard orderItem={orderItem} key={index} />
        ) : (
          ""
        )
      )}
      <p className="pt-5 ms-5 text-[#EB722C] underline decoration-[#EB722C] font-semibold text-xs">
        <Link to={`${path}`}>View Details</Link>
      </p>
    </div>
  );
};

export default CurrentOrders;
