import React, { useContext, useEffect } from "react";
import bg from "../../assets/images/reset-password-bg.svg";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  sendEditPassword,
  sendUserData,
} from "../../fetchAndPostDatas/postData";
import Routes from "../../routes/route";
import { GlobalContext } from "../../context/GlobalContext";
import "../../App.scss";
import Cookies from "js-cookie";
import { Toast } from "../../helperFunctions/alertNotification";

const ChangePassword = () => {
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [seePassword, setSeePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  let strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  let mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );
  const [passwordStrength, setPasswordStrngth] = useState("");

  async function handleResetPassword(e) {
    e.preventDefault();
    if (oldPassword.trim() === "") {
      Toast.fire({
        icon: "error",
        text: "Please enter old password!",
      });
      return;
    }
    if (newPassword.trim() === "") {
      Toast.fire({
        icon: "error",
        text: "Please enter new password!",
      });
      return;
    }
    if (confirmPassword.trim() === "") {
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
    if (oldPassword.trim() === newPassword.trim()) {
      Toast.fire({
        icon: "error",
        text: "Old password and new password can't be same!",
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
      sendEditPassword(newPassword, oldPassword, userDetails._id)
        .then((res) => {
          if (res.data.success) {
            localStorage.removeItem("password");
            setConfirmPassword("");
            setNewPassword("");
            setOldPassword("");
            Cookies.remove("token");
            routeChange("/sign-in");
          }
        })
        .catch(async (error) => {
          await Toast.fire({
            icon: "error",
            title: "Sorry, Old password did not match!",
          });
        });
    }
  }

  const { routeChange } = Routes();

  useEffect(() => {
    if (!Cookies.get("token")) {
      routeChange("/");
    }
    sendUserData().then((res) => {
      if (res.error) {
        routeChange("sign-up");
      }
      if (res.success) {
        setUserDetails(res.data);
      }
    });
  }, [setUserDetails, routeChange]);

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

  return (
    <div className="h-[100vh] overflow-y-hidden">
      <img src={bg} className="w-full scale-[2]" alt="bg" />
      <div className="xl:fixed absolute top-[40%] sm:top-[35%] sm:ms-0 w-[96%] sm:w-[70%] lg:w-[55%] xl:w-[45%] left-[2%] sm:left-[27%] lg:left-[40%] bg-[#ffff] p-5 sm:shadow-[0_0_20px_0_rgba(0,0,0,0.15)] rounded">
        <p className="sm:text-2xl font-semibold text-xl lg:pt-5 lg:mt-5">
          Reset Your Password
        </p>
        <p className="text-[#7F8490] mb-5 sm:text-base text-xs">
          Enter new password and then repeat it
        </p>
        <p className="text-[#3F414F] my-2">Old Password</p>
        <input
          className="border rounded p-2 w-full text-[#3F414F] outline-0"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <p className="text-[#3F414F] my-2 mt-3">New Password</p>
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
        <p className="text-[#3F414F] my-2 mt-3">Confirm Password</p>
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
          className=" bg-[#25CA80] text-white px-20 p-3 rounded-3xl mt-5 mb-3 w-full sm:text-lg text-sm font-medium lg:mb-5 "
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
