import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Productpage from "./components/Productpage";
import Login from "./components/Login";
import Cart from "./components/Cart";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import PageNotFound from "./components/PageNotFound";
import WishlistPage from "./components/WishlistPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./components/Dashboard";
import Unauthorized from "./components/Unauthorized";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 w-full">
        <Routes>
          <Route path="/frontend" element={<RootLayout />}>
            <Route index element={<Productpage />} />
            <Route path="Home" element={<Productpage />} />
            <Route path="/orderhistory" element={<OrderHistoryPage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="cart" element={<Cart />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route
              path="dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
