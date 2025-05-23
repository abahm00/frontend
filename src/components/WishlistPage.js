import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/wishlist/get", {
          headers: { token },
        });
        console.log("Wishlist data:", res.data.wishList);
        setWishlistItems(res.data.wishList || []);
      } catch (err) {
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
        <div className="text-lg font-medium text-gray-700">
          Loading wishlist...
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-6">{error}</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
        <div className="text-lg font-medium text-gray-700">
          Your wishlist is empty.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded shadow p-4 flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
          >
            <img
              src={product.imgCover || product.image || "/placeholder.png"}
              alt={product.title || product.name || "Product Image"}
              className="h-48 object-contain mb-4"
              onError={(e) => (e.target.src = "/placeholder.png")}
            />
            <h2 className="text-lg font-semibold mb-2">
              {product.title || product.name || "Unnamed Product"}
            </h2>
            <p className="text-gray-700 font-bold">
              ${product.price?.toFixed(2) || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
