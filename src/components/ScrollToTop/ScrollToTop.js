import React, { useEffect, useState } from "react";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bg-black bottom-[200px] right-3 cursor-pointer z-100">
      {isVisible && (
        <div
          onClick={scrollToTop}
          className="fixed p-2 rounded-lg bottom-20 right-3 lg:bottom-5 lg:right-5 cursor-pointer text-white px-3 py-2 border border-black bg-gray-100 backdrop-blur"
        >
          <KeyboardDoubleArrowUpIcon className="text-black" />
        </div>
      )}
    </div>
  );
};

export default ScrollToTop;
