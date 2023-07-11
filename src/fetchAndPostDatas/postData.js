import axios from "axios";
import { urls } from "../config/urls";
import Cookies from "js-cookie";

export async function generateOrder(
  cartOrder,
  userDetails,
  userAddress,
  grandTotal
) {
  try {
    const res = await axios
      .post(urls.addNewOrder, {
        customerId: userDetails?._id,
        customerName: userDetails?.userName,
        phoneNumber: userDetails?.phoneNumber.toString(),
        email: userDetails?.email,
        address: userAddress,
        totalAmount: grandTotal,
        items: cartOrder.map((data) => ({
          itemId: data._id ? data._id : data.itemId,
          itemName: data.item ? data.item.itemName : data.itemName,
          quantity: data.quantity,
          price: data.item ? data.item.price : data.price,
          itemImageURL: data.item ? data.item.imageURL : data.itemImageURL,
        })),
      })
      .then((response) => {
        return response;
      });
    return res;
  } catch (error) {
    return error;
  }
}

export async function sendUserData() {
  const body = {
    token: Cookies.get("token"),
  };
  const response = await axios
    .post(urls.userData, body)
    .then(function (response) {
      return response.data;
    });
  return response;
}

export async function login(email, password) {
  const body = {
    email: email,
    password: password,
  };
  try {
    const res = await axios.post(urls.login, body).then((response) => {
      return response.data;
    });
    return res;
  } catch (error) {
    return error;
  }
}

export async function registerUser(emailId, phoneNo, pass) {
  const body = {
    email: emailId,
    phoneNumber: phoneNo,
    password: pass,
  };
  try {
    const response = await axios
      .post(urls.register, body)
      .then(function (response) {
        return response.data;
      });
    return response;
  } catch (error) {
    return error.response.data;
  }
}

export async function sendEditUserData(
  id,
  name,
  email,
  phoneNumber,
  address,
  profileImage,
  profileImageName
) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("phoneNumber", phoneNumber);
  formData.append("address", address);
  formData.append("userName", name);
  formData.append("profileImage", profileImage);
  formData.append("imageName", profileImageName);
  try {
    const response = await axios
      .post(`${urls.updateUserDetails}/${id}`, formData)
      .then((response) => {
        return response;
      });
    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function sendEditPassword(newPassword, oldPassword, userId) {
  try {
    const response = await axios
      .post(`${urls.resetPassword}`, {
        token: Cookies.get("token"),
        newPassword: newPassword,
        oldPassword: oldPassword,
        userId: userId,
      })
      .then((res) => {
        return res;
      });

    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function forgetPassword(token, email, newPassword) {
  const body = {
    token: token,
    email: email,
    newPassword: newPassword,
  };
  try {
    const response = await axios
      .post(urls.forgetPassword, body)
      .then((response) => {
        return response;
      });
    return response.data;
  } catch (error) {
    return error
  }
}

export async function sendIncompleteOrder(id, incompleteOrders) {
  try {
    const response = await axios
      .post(urls.incompleteOrder, {
        customerId: id,
        incompleteItems: incompleteOrders.map((data) => ({
          itemId: data._id ? data._id : data.itemId,
          itemName: data.item ? data.item.itemName : data.itemName,
          quantity: data.quantity,
          price: data.item ? data.item.price : data.price,
          itemImageURL: data.item ? data.item.imageURL : data.imageURL,
        })),
      })
      .then((res) => {
        return res;
      });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function setWishlistItem(id, wishlistItems) {
  try {
    const response = await axios
      .post(urls.addToWishlist, {
        customerID: id,
        items: wishlistItems,
      })
      .then((data) => {
        return data;
      });
    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}
