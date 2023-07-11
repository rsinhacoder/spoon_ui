import axios from "axios";
import { urls } from "../config/urls";

const deleteFunction = async (url) => {
  try {
    const response = await axios.delete(url).then(function (response) {
      return response;
    });
    if (response) {
      return response;
    }
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const deleteIncompleteOrder = async (id) => {
  const response = await deleteFunction(`${urls.deleteIncompleteOrder}/${id}`);
  return response;
};

export const removeFromWishlist = async (customerId) => {
  const response = await deleteFunction(
    `${urls.deleteWishlistFood}/${customerId}`
  );
  return response;
};
