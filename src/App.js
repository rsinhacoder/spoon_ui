import React from "react";
import "./App.scss";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import SetPassword from "./pages/SetPassword/SetPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Category from "./pages/Categories/Category";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders/Orders";
import { GlobalProvider } from "./context/GlobalContext";
import EditProfile from "./pages/EditProfile/EditProfile.js";
import ViewProfile from "./pages/ViewProfile/ViewProfile";
import CurrentOrderPage from "./pages/CurrentOrders/CurrentOrdersPage";
import OrderDetails from "./components/Orders/OrdersDetails";
import OldOrders from "./pages/OldOrders/OldOrders";
import { CartProvider } from "./context/CartContext";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Wishlist from "./pages/Wishlist/Wishlist";
import PopularFood from "./pages/PopularFoods/PopularFoods";
import { PageNotFound } from "./components/PageNotFound/PageNotFound";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

const App = () => {
  return (
    <>
      <GlobalProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route
                path="/user/reset-password/:id/:token"
                element={<ResetPassword />}
              />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/category/:type" element={<Category />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<ViewProfile />} />
              <Route path="/editprofile" element={<EditProfile />} />
              <Route
                path="/currentorderspage/:id/:userId"
                element={<CurrentOrderPage />}
              />
              <Route
                path="/ordersdetails/:type/:id/:userId"
                element={<OrderDetails />}
              />
              <Route path="/oldorders" element={<OldOrders />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/popularfoods" element={<PopularFood />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
          <ScrollToTop />
        </CartProvider>
      </GlobalProvider>
    </>
  );
};

export default App;
