import axios from "axios";
import { urls } from "../config/urls";

const getFunction = async (url) => {
  try {
    const response = await axios.get(url).then(function (response) {
      return response.data;
    });
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export async function validateUser(url) {
  const response = await getFunction(url);
  return response;
}

export async function getAllCategories() {
  const response = await getFunction(urls.allCategories);
  return response;
}

export async function getSingleCategory(category) {
  const response = await getFunction(`${urls.singleCategory}/${category}`);
  return response;
}

export async function getAllItems(id) {
  const response = await getFunction(`${urls.allItems}/${id}`);
  return response;
}

export async function getCurrentOrders(id) {
  const response = await getFunction(`${urls.currentOrderDetails}/${id}`);
  return response;
}

export async function getAllPastOrders(id) {
  const response = await getFunction(`${urls.allPastOrders}/${id}`);
  return response;
}

export async function getItemDetails(id) {
  const response = await getFunction(`${urls.ItemDetails}/${id}`);
  return response;
}

export async function getAllFoodItems() {
  const response = await getFunction(urls.allFoodItems);
  return response;
}

export async function getAllPopularFoodItems() {
  const response = await getFunction(urls.allPopularFoodItem);
  return response;
}

export async function getLocation(lat, lon) {
  const response = await getFunction(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=6c774d5a16a843889a79f7c4cdf8e683`
  );
  return response;
}

export async function getOrderById(id) {
  const response = await getFunction(`${urls.singleOrder}/${id}`);
  return response;
}

export async function getAllWishlistItems(customerId) {
  const response = await getFunction(`${urls.wishlist}/${customerId}`);
  return response;
}

export async function getIncompleteOrders(id) {
  const response = await getFunction(`${urls.getIncompleteOrder}/${id}`);
  return response;
}

export async function getResturantStatus() {
  const response = await getFunction(urls.restaurantOpenStatus);
  return response;
}
