import {
  sendIncompleteOrder,
  setWishlistItem,
} from "../fetchAndPostDatas/postData";
import {
  deleteIncompleteOrder,
  removeFromWishlist,
} from "../fetchAndPostDatas/deleteData";

export const logout = async (localData, userDetails, wishlistItems) => {
  let i = 0;
  if (localData !== null) {
    await sendIncompleteOrder(userDetails._id, JSON.parse(localData)).then(
      (res) => {
        if (res.data.success) {
          return i++;
        }
      }
    );
  } else {
    await deleteIncompleteOrder(userDetails._id).then((res) => {
      if (res.data.success) {
        return i++;
      }
    });
  }
  if (wishlistItems !== null) {
    await setWishlistItem(userDetails._id, JSON.parse(wishlistItems)).then(
      (res) => {
        if (res.data.success) {
          return i++;
        }
      }
    );
  } else {
    await removeFromWishlist(userDetails._id).then((res) => {
      if (res.data.success) {
        return i++;
      }
    });
  }
  if (i === 2) {
    return i;
  }
};
