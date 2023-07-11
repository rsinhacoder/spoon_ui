import React, { useState, useRef, useEffect } from "react";
import banner from "../../assets/images/banner-sign-up.svg";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../App.scss";
import { registerUser } from "../../fetchAndPostDatas/postData";

const SignUp = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkedTermsAndConditions, setCheckedTermsAndConditions] =
    useState("");
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const phoneNoFormat = /^\d{10}$/;
  let strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  let mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  );
  const [passwordStrength, setPasswordStrngth] = useState("");

  const handleSignUp = async (e) => {
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
    if (emailRef.current.value.trim() === "") {
      await Toast.fire({
        icon: "error",
        text: "Please enter proper email!",
      });
      return;
    }
    if (!emailRef.current.value.match(mailFormat)) {
      await Toast.fire({
        icon: "error",
        text: "Invalid email!",
      });
      return;
    }
    if (phoneNumberRef.current.value.trim() === "") {
      await Toast.fire({
        icon: "error",
        text: "Please enter phone number!",
      });
      return;
    }
    if (!phoneNumberRef.current.value.match(phoneNoFormat)) {
      await Toast.fire({
        icon: "error",
        text: "Invalid phone number!",
      });
      return;
    }
    if (password.trim() === "") {
      await Toast.fire({
        icon: "error",
        text: "Enter new password!",
      });
      return;
    }
    if (confirmPassword.trim() === "") {
      await Toast.fire({
        icon: "error",
        text: "Enter confirm password!",
      });
      return;
    }
    if (password !== confirmPassword) {
      await Toast.fire({
        icon: "error",
        title: "Please enter same passwords",
      });
      return;
    }
    if (passwordStrength === "Weak Password") {
      await Toast.fire({
        icon: "error",
        text: "Please enter a stronger password!",
      });
      return;
    }
    if (!checkedTermsAndConditions) {
      await Toast.fire({
        icon: "warning",
        title: "Please check terms and conditions box.",
      });
      return;
    } else {
      const response = await registerUser(
        emailRef.current.value,
        phoneNumberRef.current.value,
        password
      );
      if (response.error) {
        await Toast.fire({
          icon: "error",
          title: `${response.message}`,
        });
      } else {
        await Toast.fire({
          icon: "info",
          title: `${response.message}`,
        });
        if (response.success) {
          setPassword("");
          setConfirmPassword("");
          navigate("/sign-in");
        }
      }
    }
  };

  useEffect(() => {
    strongPassword.test(password)
      ? setPasswordStrngth("Strong Password")
      : mediumPassword.test(password)
      ? setPasswordStrngth("Medium Password")
      : setPasswordStrngth("Weak Password");
    if (password === "") {
      setPasswordStrngth("");
    }
  }, [password]);

  return (
    <div className="overflow-hidden">
      <img
        src={banner}
        className="scale-180 lg:scale-250 lg:mt-16 lg:ms-10 xl:ms-36 mt-[-10%]"
        alt="banner"
      />
      <div className="xl:fixed absolute lg:top-[15%] 2xl:top-[18%] top-[15%] left-[7%] w-[86%] md:w-[50%] sm:left-[25%] bg-transparent p-4 md:bg-white sm:shadow-[0_0_20px_0_rgba(0,0,0,0.15)] login-popup rounded-lg">
        <h3 className="text-2xl font-semibold">Let's Create Your Account</h3>
        <p className="text-[#7F8490] mb-5 sm:text-base text-xs">
          Sign up with your valid email address
        </p>
        <p className="text-[#3F414F] my-2">Email Id</p>
        <input
          className="border rounded p-2 w-full text-[#3F414F] outline-0"
          type="email"
          id="email"
          ref={emailRef}
        />
        <p className="text-[#3F414F] my-2 mt-3">Phone Number</p>
        <input
          className="border rounded p-2 w-full text-[#3F414F] outline-0"
          type="number"
          id="phoneNumber"
          ref={phoneNumberRef}
        />
        <p className="text-[#3F414F] my-2 mt-3">Password</p>
        <div className="border rounded  w-full flex justify-between items-center">
          <input
            className="text-[#3F414F] p-2 outline-0"
            type={seePassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
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
        <div className="border rounded  w-full flex justify-between items-center">
          <input
            className="text-[#3F414F] p-2 outline-0"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <div className="flex my-3">
          <input
            className="me-2"
            type="checkbox"
            onChange={(e) => {
              setCheckedTermsAndConditions(e.target.checked);
            }}
          />
          <p className="text-[#5B5B5B] sm:text-base text-xs">
            I agree with the Terms & Conditions
          </p>
        </div>
        <button
          onClick={handleSignUp}
          className="text-lg bg-[#25CA80] text-white px-20 p-3 rounded-3xl mt-5 mb-3 w-full"
        >
          CONTINUE
        </button>
        <p className="text-center text-[#5B5B5B] mb-2 sm:text-base text-xs">
          Already have an account?
          <button className="text-[#EB722C] pl-1">
            <Link to="/sign-in"> Signin </Link>
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
