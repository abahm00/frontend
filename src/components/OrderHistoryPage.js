import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      token,
    },
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3001/order/history",
        axiosConfig
      );
      if (res.data.orders) {
        setOrders(res.data.orders);
        setError("");
      } else {
        setOrders([]);
        setError(res.data.message || "No orders found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Loading order history...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold px-4 text-center">
        Error: {error}
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold px-4 text-center">
        No orders found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 w-full">
      <h2 className="text-3xl font-bold text-red-700 mb-6 text-center sm:text-left">
        Your Order History
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200"
          >
            <h3 className="text-xl font-semibold text-red-800 mb-3 break-words">
              Order ID: {order._id}
            </h3>

            <p className="text-red-700 mb-2">
              <strong>Total Price:</strong> ${order.totalOrderPrice.toFixed(2)}
            </p>

            {order.shippingAddress && (
              <div className="mb-4 text-red-700">
                <strong>Shipping Address:</strong>
                <p className="break-words">
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-md shadow-sm text-red-900">
                <thead className="bg-red-200">
                  <tr>
                    <th className="py-2 px-4 text-left font-semibold">
                      Product
                    </th>
                    <th className="py-2 px-4 text-right font-semibold">
                      Price
                    </th>
                    <th className="py-2 px-4 text-center font-semibold">
                      Quantity
                    </th>
                    <th className="py-2 px-4 text-right font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-red-300 even:bg-red-100"
                    >
                      <td className="py-3 px-4 font-medium break-words max-w-xs">
                        {item.product?.title || "Unnamed product"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-red-600">
              <em>Ordered on: {new Date(order.createdAt).toLocaleString()}</em>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
