import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

let parsedUser = null;
try {
  const userFromLocalStorage = localStorage.getItem("user");
  parsedUser =
    userFromLocalStorage && userFromLocalStorage !== "undefined"
      ? JSON.parse(userFromLocalStorage)
      : null;
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
  parsedUser = null;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: {
      user: parsedUser,
      isAuthenticated: !!parsedUser,
      token: localStorage.getItem("token") || null,
    },
  },
});
