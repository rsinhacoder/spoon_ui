export function cartPrice(cart) {
  return cart.reduce(
    (total, productData) =>
      total +
      productData.quantity *
        (productData.item ? productData.item.price : productData.price),
    0
  );
}

export function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export function addQuantity(cart, setCart, cartData, flag) {
  const cartDataId = cartData._id ? cartData._id : cartData.itemId;
  if (
    cart.some(
      (cartItem) =>
        (cartItem._id ? cartItem._id : cartItem.itemId) === cartDataId
    )
  ) {
    setCart((cart) =>
      cart.map((cartItem) =>
        (cartItem._id ? cartItem._id : cartItem.itemId) === cartDataId
          ? flag === 0
            ? { ...cartItem, quantity: cartItem.quantity + cartData.quantity }
            : { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
    return;
  }
  setCart((cart) => [
    ...cart,
    { ...cartData, quantity: cartData.quantity ? cartData.quantity : 1 },
  ]);
}

export function deleteQuantity(cart, setCart, cartData) {
  const cartDataId = cartData._id ? cartData._id : cartData.itemId;
  setCart((cart) =>
    cart.flatMap((cartItem) =>
      (cartItem._id ? cartItem._id : cartItem.itemId) === cartDataId
        ? cartItem.quantity - 1 < 1
          ? []
          : [{ ...cartItem, quantity: cartItem.quantity - 1 }]
        : [cartItem]
    )
  );
  if (cart.length === 1) {
    localStorage.removeItem("cartData");
  }
}

export function addWishItems(wishList, setWishList, popularFoodItems) {
  setWishList((wishList) => [...wishList, popularFoodItems]);
}

export function removeItems(
  stateValue,
  setfunction,
  foodItem,
  localStorageKey
) {
  setfunction((stateValue) =>
    stateValue.filter(
      (item) => (item._id ? item._id : item.itemId) !== foodItem
    )
  );
  if (stateValue.length === 1) {
    localStorage.removeItem(`${localStorageKey}`);
  }
}
