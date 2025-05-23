import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    phone: "",
  });

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  const API_URL = "http://localhost:3001/cart";
  const ORDER_API_URL = "http://localhost:3001/order";
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      token: token,
    },
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/get`, axiosConfig);
      setCart(res.data.cart);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) return;
      await axios.put(
        `${API_URL}/update`,
        { product: itemId, quantity },
        axiosConfig
      );
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/delete`, {
        data: { product: itemId },
        ...axiosConfig,
      });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const applyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    setIsApplying(true);

    try {
      const res = await axios.post(
        `${API_URL}/applyCoupon`,
        { code: couponCode },
        axiosConfig
      );
      setCart(res.data.cart);
      setCouponSuccess("Coupon applied successfully!");
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon");
      await fetchCart();
    } finally {
      setIsApplying(false);
    }
  };

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const placeCashOrder = async () => {
    setOrderError("");
    setOrderSuccess("");
    setOrderLoading(true);

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      setOrderError("Please fill all shipping address fields.");
      setOrderLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${ORDER_API_URL}/create/${cart._id}`,
        {
          city: shippingAddress.city,
          street: shippingAddress.street,
          phone: shippingAddress.phone,
        },
        axiosConfig
      );

      setOrderSuccess("✅ Order placed successfully! Thank you.");
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  };

  const placeStripeOrder = async () => {
    setOrderError("");
    setOrderSuccess("");
    setOrderLoading(true);

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      setOrderError("Please fill all shipping address fields.");
      setOrderLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${ORDER_API_URL}/checkout/${cart._id}`,
        {
          city: shippingAddress.city,
          street: shippingAddress.street,
          phone: shippingAddress.phone,
        },
        axiosConfig
      );

      const sessionId = res.data.session.id;

      if (!window.Stripe) {
        setOrderError("Stripe.js not loaded");
        setOrderLoading(false);
        return;
      }

      const stripe = window.Stripe(
        "pk_test_51RRxy1RqLVMLDrLJawFfaFRr2a6rYytHfSp0aRxk8UVMzuruiIYbnUT0U1V7tRmpBn31WRg9TbBA5pfBFKiINJ8e005ebQKzkE"
      ); // Use your publishable key here

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        setOrderError(error.message || "Stripe checkout failed");
      }
    } catch (err) {
      setOrderError(
        err.response?.data?.message || "Failed to initiate payment"
      );
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Loading cart...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  if (!cart || cart.cartItems.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Your cart is empty
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 w-full">
      <h2 className="text-3xl font-bold text-red-700 mb-6 text-center sm:text-left">
        Your Cart
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full w-full bg-red-50 rounded-lg shadow-md">
          <thead className="bg-red-200">
            <tr>
              <th className="py-3 px-5 text-left text-red-900 font-semibold uppercase text-sm min-w-[200px]">
                Product
              </th>
              <th className="py-3 px-5 text-right text-red-900 font-semibold uppercase text-sm">
                Price
              </th>
              <th className="py-3 px-5 text-center text-red-900 font-semibold uppercase text-sm">
                Quantity
              </th>
              <th className="py-3 px-5 text-right text-red-900 font-semibold uppercase text-sm">
                SubTotal
              </th>
              <th className="py-3 px-5 text-center text-red-900 font-semibold uppercase text-sm min-w-[80px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.cartItems.map((item) => (
              <tr
                key={item._id}
                className="border-b border-red-300 even:bg-red-100"
              >
                <td className="py-4 px-5 text-red-800 font-medium flex items-center gap-4">
                  <img
                    src={
                      item.product?.imgCover ||
                      "https://via.placeholder.com/64?text=No+Image"
                    }
                    alt={item.product?.title || "Product Image"}
                    className="w-16 h-16 object-cover rounded-md shadow-sm"
                  />
                  <span>{item.product?.title || "Unnamed product"}</span>
                </td>
                <td className="py-4 px-5 text-red-800 text-right">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-4 px-5 text-center">
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    max={item.product?.stock || 99}
                    onChange={(e) =>
                      updateQuantity(item._id, Number(e.target.value))
                    }
                    className="w-16 text-center border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </td>
                <td className="py-4 px-5 text-red-800 text-right font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="py-4 px-5 text-center">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coupon Section */}
      <div className="mt-8 max-w-md mx-auto sm:mx-0">
        <h3 className="text-xl font-semibold text-red-700 mb-3">
          Apply Coupon
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-grow border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={applyCoupon}
            disabled={isApplying}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
          >
            {isApplying ? "Applying..." : "Apply"}
          </button>
        </div>
        {couponError && (
          <p className="mt-2 text-red-600 font-semibold">{couponError}</p>
        )}
        {couponSuccess && (
          <p className="mt-2 text-green-600 font-semibold">{couponSuccess}</p>
        )}
      </div>

      {/* Price Summary */}
      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4 text-red-800 font-bold text-xl max-w-md mx-auto sm:mx-0">
        <div>
          <span>Total: </span>${cart.totalPrice.toFixed(2)}
        </div>
        {typeof cart.totalPriceAfterDiscount === "number" &&
          cart.totalPriceAfterDiscount > 0 &&
          cart.totalPriceAfterDiscount < cart.totalPrice && (
            <>
              <div>
                <span>Discount: </span> -$
                {(cart.totalPrice - cart.totalPriceAfterDiscount).toFixed(2)}
              </div>
              <div className="text-2xl text-red-900">
                <span>New Total: </span>$
                {cart.totalPriceAfterDiscount.toFixed(2)}
              </div>
            </>
          )}
      </div>

      {/* Shipping Address Form */}
      <div className="mt-10 max-w-md mx-auto sm:mx-0">
        <h3 className="text-xl font-semibold text-red-700 mb-3">
          Shipping Address
        </h3>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={shippingAddress.street}
            onChange={handleAddressChange}
            required
            className="border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            required
            className="border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={shippingAddress.phone}
            onChange={handleAddressChange}
            required
            className="border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </form>
      </div>

      {/* Order Buttons & Status */}
      <div className="mt-8 max-w-md mx-auto sm:mx-0 flex flex-col gap-4">
        {orderError && (
          <div className="text-red-600 font-semibold">{orderError}</div>
        )}
        {orderSuccess && (
          <div className="text-green-600 font-semibold">{orderSuccess}</div>
        )}

        <button
          onClick={placeCashOrder}
          disabled={orderLoading}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
        >
          {orderLoading ? "Placing Order..." : "Place Order"}
        </button>

        <button
          disabled={orderLoading}
          onClick={placeStripeOrder}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {orderLoading
            ? "Redirecting to Payment..."
            : "Pay with Card (Stripe)"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
