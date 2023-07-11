import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";

const RateOrders = ({ showRating, setShowRating }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  return (
    <div>
      <div>
        <p className=" mt-4 text-md font-medium ">Rate Your Experience</p>
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;

          return (
            <StarIcon
              className=" cursor-pointer text-[#b9bdbf] p-0 m-0"
              key={ratingValue}
              style={
                (hover || rating) >= ratingValue
                  ? { color: "#fbc105" }
                  : { color: "#b9bdbf" }
              }
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
        <button
          className="block bg-[#25CA80] rounded text-white px-3 py-1 font-medium  mt-2 cursor-pointer"
          onClick={() => {
            setShowRating(!showRating);
          }}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default RateOrders;
