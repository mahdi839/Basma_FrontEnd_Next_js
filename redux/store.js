// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/CartSlice";
import authSlice from "./slices/authSlice";

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authSlice
  }
});