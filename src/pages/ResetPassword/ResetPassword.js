import React, { useState, useEffect } from "react";
import banner from "../../assets/images/banner-1.svg";
import { useParams } from "react-router-dom";
import { urls } from "../../config/urls";
import Swal from "sweetalert2";
import "../../App.scss";
import { validateUser } from "../../fetchAndPostDatas/fetchData";
import { forgetPassword } from "../../fetchAndPostDatas/postData";
import Routes from "../../routes/route";

const ResetPassword = () => {
  const { routeChange } = Routes()
  const [showResetPasswordPage, setShowResetPasswordPage] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  let strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  let mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );
  const [passwordStrength, setPasswordStrngth] = useState("");

  async function validateToken() {
    const response = await validateUser(`${urls.resetPassword}/${id}/${token}`);
    if (response.error) {
      console.log(response.error.message);
    } else {
      setEmail(response.data.email);
      response.success
        ? setShowResetPasswordPage(true)
        : setShowResetPasswordPage(false);
    }
  }

  useEffect(() => {
    strongPassword.test(newPassword)
      ? setPasswordStrngth("Strong Password")
      : mediumPassword.test(newPassword)
      ? setPasswordStrngth("Medium Password")
      : setPasswordStrngth("Weak Password");
    if (newPassword === "") {
      setPasswordStrngth("");
    }
  }, [newPassword]);

  async function handleResetPassword(e) {
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
    if (newPassword.trim() === "" || newPassword.trim() === null) {
      Toast.fire({
        icon: "error",
        text: "Please enter new password!",
      });
      return;
    }
    if (confirmPassword.trim() === "" || confirmPassword.trim() === null) {
      Toast.fire({
        icon: "error",
        text: "Please enter confirm password!",
      });
      return;
    }
    if (passwordStrength === "Weak Password") {
      Toast.fire({
        icon: "error",
        text: "Please enter a stronger password!",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      await Toast.fire({
        icon: "error",
        title: "Password did not match",
      });
      setConfirmPassword("");
      setNewPassword("");
    } else {
      const response = await forgetPassword(token, email, newPassword);
      if (response.success){
        await Toast.fire({
          icon: "success",
          title: response.message,
        });
        setConfirmPassword("");
        setNewPassword("");
        routeChange("/sign-in")
      }
      else{
        await Toast.fire({
          icon: "error",
          title: response.response.data.message,
        });
        setConfirmPassword("");
        setNewPassword("");
      }
    }
  }

  useEffect(() => {
    validateToken();
  }, []);

  if (showResetPasswordPage) {
    return (
      <div className="overflow-hidden h-[100vh]">
        <img
          src={banner}
          className="scale-250 md:scale-150 w-full my-16 ms-5 md:ms-[-18%]"
          alt="banner"
        />
        <div className="xl:fixed absolute top-[57%] sm:top-[35%] sm:ms-0 w-[96%] sm:w-[70%] lg:w-[55%] xl:w-[45%] left-[2%] sm:left-[27%] lg:left-[40%] bg-[#ffff] p-5 sm:shadow-[0_0_20px_0_rgba(0,0,0,0.15)] rounded">
          <p className="sm:text-2xl font-semibold text-xl lg:pt-5 lg:mt-5">
            Reset Your Password
          </p>
          <p className="text-[#7F8490] mb-5 sm:text-base text-xs">
            Enter new password and then repeat it
          </p>
          <p className="text-[#3F414F] my-2">New Password</p>
          <div className="border rounded w-full flex justify-between items-center">
            <input
              className="text-[#3F414F] p-2 outline-0"
              type={seePassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <i
              className="fas fa-light fa-eye p-2"
              onClick={() => {
                seePassword ? setSeePassword(false) : setSeePassword(true);
              }}
            ></i>
          </div>
          <div className="relative flex justify-start">
            <p
              className={`absolute text-[10px] ${
                passwordStrength === "Strong Password"
                  ? "text-green-500"
                  : passwordStrength === "Medium Password"
                  ? "text-blue-500"
                  : "text-red-500"
              }`}
            >
              {passwordStrength}
            </p>
          </div>
          <p className="text-[#3F414F] my-2 mt-4">Confirm Password</p>
          <div className="border rounded w-full flex justify-between items-center">
            <input
              className="text-[#3F414F] p-2 outline-0"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <button
            onClick={handleResetPassword}
            className="bg-[#25CA80] text-white px-20 p-3 rounded-3xl mt-5 mb-3 w-full sm:text-lg text-sm font-medium lg:mb-5"
          >
            SAVE
          </button>
        </div>
      </div>
    );
  }
  return "Invalid link";
};

export default ResetPassword;
