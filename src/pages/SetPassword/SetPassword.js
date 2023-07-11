import React, { useRef } from "react";
import banner from "../../assets/images/banner-set-password.svg";
import { urls } from "../../config/urls";
import Swal from "sweetalert2";
import "../../App.scss";

const SetPassword = () => {
  const emailRef = useRef();

  const handleSetPassword = async (e) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      iconColor: "white",
      customClass: {
        popup: "colored-toast",
      },
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    e.preventDefault();
    const response = await fetch(`${urls.setPassword}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ email: emailRef.current.value }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
    if (response.error) {
      console.log(response.error.message);
    } else {
      if (response.success) {
        await Toast.fire({
          icon: "success",
          title: `${response.message}`,
        });
      } else {
        await Toast.fire({
          icon: "error",
          title: `${response.message}`,
        });
      }
    }
  };

  return (
    <div className="overflow-hidden">
      <img
        src={banner}
        className="scale-200 ms-14 mt-5 md:scale-150 md:ms-[-8%] lg:ms-[-14%] xl:ms-[-20%] 2xl:ms-[-11%] w-full h-[50vh] sm:h-[100vh]"
        alt="banner"
      />

      <div className="xl:fixed absolute top-[57%] sm:top-[35%] sm:ms-0 w-[96%] sm:w-[60%] lg:w-[45%] left-[2%] sm:left-[30%] lg:left-[40%] bg-[#ffff] p-5 sm:shadow-[0_0_20px_0_rgba(0,0,0,0.15)] rounded ">
        <p className="text-2xl font-semibold sm:pt-3 sm:mt-3 lg:pt-5 lg:mt-5 ">
          Set Profile Password
        </p>
        <p className="text-[#7F8490] mb-10">Please create a secure password</p>
        <p className="text-[#3F414F] my-3">Enter Email Id</p>
        <input
          className="border rounded p-2 w-full text-[#3F414F] outline-0"
          type="email"
          id="email"
          ref={emailRef}
        />
        <div className="flex justify-between my-3"></div>
        <div className="flex items-center justify-center sm:pt-3 sm:mt-3 lg:pb-5 lg:mt-5">
          <button
            onClick={handleSetPassword}
            className="bg-[#25CA80] text-white rounded-full w-full py-2"
          >
            SEND EMAIL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
