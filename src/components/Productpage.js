import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function ProductPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState([0, 1000]);
  const [filterRating, setFilterRating] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3001/category/get", {});
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/product/get");
        setData(response.data.products);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/wishlist/get", {
          headers: { token },
        });
        setWishlist(res.data.wishList || []);
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      }
    };
    fetchWishlist();
  }, []);

  const isInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId || item === productId);

  const toggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (isInWishlist(product._id)) {
        const res = await axios.delete(
          "http://localhost:3001/wishlist/delete",
          {
            headers: { token },
            data: { product: product._id },
          }
        );
        setWishlist(res.data.wishList);
      } else {
        const res = await axios.patch(
          "http://localhost:3001/wishlist/add",
          { product: product._id },
          { headers: { token } }
        );
        setWishlist(res.data.wishList);
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  const handleFiltersAndSort = useCallback(() => {
    let filtered = [...data];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterCategory) {
      filtered = filtered.filter(
        (product) => product.category === filterCategory
      );
    }
    filtered = filtered.filter(
      (product) =>
        product.price >= filterPrice[0] && product.price <= filterPrice[1]
    );
    if (filterRating > 0) {
      filtered = filtered.filter(
        (product) => (product.rateAvg || 0) >= filterRating
      );
    }

    if (sortOption === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating-desc") {
      filtered.sort((a, b) => (b.rateAvg || 0) - (a.rateAvg || 0));
    } else if (sortOption === "rating-asc") {
      filtered.sort((a, b) => (a.rateAvg || 0) - (b.rateAvg || 0));
    }
    return filtered;
  }, [
    data,
    searchQuery,
    filterCategory,
    filterPrice,
    filterRating,
    sortOption,
  ]);

  useEffect(() => {
    setFilteredData(handleFiltersAndSort());
    setCurrentPage(1);
  }, [handleFiltersAndSort]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredData, currentPage, itemsPerPage]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const addToCart = async () => {
    if (!selectedProduct) return;
    setAddingToCart(true);
    setAddToCartError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/cart/add",
        {
          product: selectedProduct._id,
          price: selectedProduct.price,
          quantity,
        },
        { headers: { token } }
      );
      alert("Added to cart!");
      setSelectedProduct(null);
    } catch (err) {
      setAddToCartError(
        err.response?.data?.message || "Failed to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-80 flex justify-center items-center bg-gray-100 p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 border-t-4 border-red-600 border-solid rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-1/4 mb-6 md:mb-0 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Price Range ($)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  value={filterPrice[0]}
                  onChange={(e) =>
                    setFilterPrice([
                      Math.max(0, Number(e.target.value)),
                      filterPrice[1],
                    ])
                  }
                  className="w-1/2 border p-2 rounded"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  value={filterPrice[1]}
                  onChange={(e) =>
                    setFilterPrice([
                      filterPrice[0],
                      Math.max(0, Number(e.target.value)),
                    ])
                  }
                  className="w-1/2 border p-2 rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Minimum Rating
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="w-full border p-2 rounded"
              >
                <option value={0}>Any</option>
                <option value={1}>1 star</option>
                <option value={2}>2 stars</option>
                <option value={3}>3 stars</option>
                <option value={4}>4 stars</option>
                <option value={5}>5 stars</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">None</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
              </select>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedData.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded shadow relative cursor-pointer hover:shadow-lg"
              >
                <img
                  src={product.imgCover}
                  alt={product.title}
                  className="w-full h-48 object-contain mb-2"
                  onClick={() => setSelectedProduct(product)}
                />
                <h3
                  className="text-lg font-semibold truncate cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.title}
                </h3>
                <p className="text-gray-700 font-semibold">${product.price}</p>
                <div className="absolute top-2 right-2 text-red-600 text-xl cursor-pointer">
                  {isInWishlist(product._id) ? (
                    <FaHeart onClick={() => toggleWishlist(product)} />
                  ) : (
                    <FaRegHeart onClick={() => toggleWishlist(product)} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-3 items-center">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-red-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded p-6 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              aria-label="Close product details"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
            <img
              src={selectedProduct.imgCover}
              alt={selectedProduct.title}
              className="w-full h-64 object-contain mb-4"
            />
            <p className="mb-4">{selectedProduct.description}</p>
            <p className="mb-2 font-semibold">
              Category:{" "}
              {categories.find((c) => c._id === selectedProduct.category)
                ?.name || selectedProduct.category}
            </p>
            <p className="mb-2 font-semibold">
              Price: ${selectedProduct.price.toFixed(2)}
            </p>
            <p className="mb-2 font-semibold">
              Rating: ⭐ {selectedProduct.rateAvg?.toFixed(1) || "N/A"}
            </p>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  setQuantity(val);
                }}
                className="w-20 border p-2 rounded"
              />
            </div>

            <button
              onClick={addToCart}
              disabled={addingToCart}
              className={`w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition ${
                addingToCart ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            {addToCartError && (
              <p className="mt-2 text-red-500 font-semibold">
                {addToCartError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
