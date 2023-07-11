import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Routes from "../../routes/route";
import { GlobalContext } from "../../context/GlobalContext";
import {
  sendEditUserData,
  sendUserData,
} from "../../fetchAndPostDatas/postData";
import default_dp from "../../assets/images/default_dp.png";
import Cookies from "js-cookie";
import { decryptDatas, encryptDatas } from "../../helperFunctions/encryptData";

const EditProfile = () => {
  const phoneNoFormat = /^\d{10}$/;
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const { userDetails, setUserDetails } = useContext(GlobalContext);
  const [name, setName] = useState(userDetails?.userName);
  const [address, setaddress] = useState(userDetails?.address);
  const [email, setEmail] = useState(userDetails?.email);
  const [phoneNumber, setPhoneNumber] = useState(userDetails?.phoneNumber);
  const [viewImage, setViewImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageName, setProfileImageName] = useState("");
  const { routeChange } = Routes();
  const [errorMsg, setErrorMsg] = useState("");

  const handleProfileImage = (e) => {
    let reader = new FileReader();
    try {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setViewImage(reader.result);
      };
      setProfileImage(e.target.files[0]);
      setProfileImageName(e.target.files[0].name);
    } catch (error) {
      console.log(error);
    }
  };

  const editProfileData = () => {
    if (name === undefined || name.trim() === "" || name === null) {
      setErrorMsg("Invalid name!");
      return;
    }
    if (address === undefined || address.trim() === "" || address === null) {
      setErrorMsg("Invalid address");
      return;
    }
    if (email.trim() === "" || email === null || !email.match(mailFormat)) {
      setErrorMsg("Invalid Email!");
      return;
    }
    if (phoneNumber === null || !phoneNumber.toString().match(phoneNoFormat)) {
      setErrorMsg("Invalid phone number!");
      return;
    }
    if (isNaN(phoneNumber)) {
      setErrorMsg("Phone number has to be a number!");
      return;
    }
    sendEditUserData(
      userDetails._id,
      name,
      email,
      phoneNumber,
      address,
      profileImage,
      profileImageName
    ).then((response) => {
      if (response.data.success) {
        sendUserData().then((response) => {
          if (response.success) {
            encryptDatas("userData", response.data);
            routeChange("/profile");
          }
        });
      }
    });
  };

  useEffect(() => {
    if (!Cookies.get("token")) {
      routeChange("/");
    }
    const userDetail = decryptDatas("userData");
    if (userDetail) {
      setUserDetails(userDetail);
      setName(userDetail?.userName);
      setEmail(userDetail?.email);
      setPhoneNumber(userDetail?.phoneNumber);
      setaddress(userDetail?.address);
    }
  }, []);

  if (userDetails._id) {
    return (
      <div className="w-full overflow-auto sm:w-[40rem] sm:m-auto sm:p-5 sm:mt-10 sm:rounded-lg sm:shadow-[0_0_20px_0_rgba(0,0,0,0.45)]">
        <div className="flex m-3">
          <i
            className="fas fa-regular fa-arrow-left cursor-pointer pt-1"
            onClick={() => {
              routeChange("/profile");
            }}
          ></i>
          <p className="ms-2 font-semibold">
            Settings /
            <span className="font-light text-[#757575]"> My Profile</span>
          </p>
        </div>
        <div className="flex justify-center mt-10">
          <label htmlFor="filePicker" className="flex justify-center">
            <img
              src={
                viewImage
                  ? viewImage
                  : userDetails.imageURL
                  ? `${userDetails.imageURL}`
                  : default_dp
              }
              alt="user"
              className="min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px] md:min-w-[90px] md:max-w-[90px] md:min-h-[90px] md:max-h-[90px] border-2 border-white hover:border-black hover:opacity-50 rounded-full"
            />
          </label>
          <input
            accept="image/*"
            id="filePicker"
            className="hidden"
            type="file"
            onChange={handleProfileImage}
          ></input>
        </div>
        <div className="relative flex justify-center">
          <p className="absolute mt-4 text-red-600">{errorMsg}</p>
        </div>
        <div className="mt-16 px-5">
          <p>Full Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="border-b-2 w-full outline-0 mb-5 mt-3 border-[#BBC1CB] font-semibold"
          />
          <p>Email</p>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="border-b-2 w-full outline-0 mb-5 mt-3 border-[#BBC1CB] font-semibold"
          />
          <p>Phone Number</p>
          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
            className="border-b-2 w-full outline-0 mb-5 mt-3 border-[#BBC1CB] font-semibold"
          />
          <p>Address</p>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setaddress(e.target.value);
            }}
            className="border-b-2 w-full outline-0 mb-5 mt-3 border-[#BBC1CB] font-semibold"
          />
        </div>
        <div className="flex justify-end me-5 text-[#FF6D5D] cursor-pointer">
          <Link to={"/changePassword"}>Reset Password</Link>
        </div>

        <div className="px-5 mt-10 mb-3">
          <button
            className="bg-[#25CA80] text-white w-full py-3 rounded-full flex m-auto justify-center"
            onClick={() => {
              editProfileData();
            }}
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    );
  }
};

export default EditProfile;
