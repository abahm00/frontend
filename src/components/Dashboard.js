import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Box,
  Input,
} from "@mui/material";
import { useSelector } from "react-redux";

const Dashboard = () => {
  // Users state
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editedCouponData, setEditedCouponData] = useState({});

  // Categories state
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryData, setEditedCategoryData] = useState({
    name: "",
    imgFile: null,
    imgPreview: "",
  });

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // New coupon form state
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expires: "",
  });

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: "",
    imgFile: null,
    imgPreview: "",
  });

  // Loading and error states
  const [error, setError] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [addingCoupon, setAddingCoupon] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imgCover: null,
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProductData, setEditedProductData] = useState({});

  const token = useSelector((state) => state.auth.token);

  // Fetch functions
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/get", {
        headers: { token },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await axios.get("http://localhost:3001/coupon/get", {
        headers: { token },
      });
      setCoupons(response.data.coupon);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/category/get", {
        headers: { token },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCoupons();
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/product/get", {
        headers: { token },
      });
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // User handlers
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/user/delete/${id}`, {
        headers: { token },
      });
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:3001/user/update/${id}`,
        editedUserData,
        { headers: { token } }
      );
      setEditingUser(null);
      setEditedUserData({});
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      setError("Please fill in all user fields.");
      return;
    }
    try {
      setAddingUser(true);
      setError("");
      await axios.post("http://localhost:3001/user/add", newUser, {
        headers: { token },
      });
      setNewUser({ name: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (error) {
      setError("Failed to add user. " + (error?.response?.data?.message || ""));
    } finally {
      setAddingUser(false);
    }
  };

  // Coupon handlers
  const handleDeleteCoupon = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/coupon/delete/${id}`, {
        headers: { token },
      });
      fetchCoupons();
    } catch (error) {
      console.error("Coupon delete failed:", error);
    }
  };

  const handleUpdateCoupon = async (id) => {
    if (
      !editedCouponData.code ||
      !editedCouponData.discount ||
      !editedCouponData.expires
    ) {
      setError("Please fill in all coupon fields.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:3001/coupon/update/${id}`,
        editedCouponData,
        { headers: { token } }
      );
      setEditingCoupon(null);
      setEditedCouponData({});
      fetchCoupons();
    } catch (error) {
      console.error("Coupon update failed:", error);
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expires) {
      setError("Please fill in all coupon fields.");
      return;
    }
    try {
      setAddingCoupon(true);
      setError("");
      await axios.post("http://localhost:3001/coupon/add", newCoupon, {
        headers: { token },
      });
      setNewCoupon({ code: "", discount: "", expires: "" });
      fetchCoupons();
    } catch (error) {
      setError(
        "Failed to add coupon. " + (error?.response?.data?.message || "")
      );
    } finally {
      setAddingCoupon(false);
    }
  };

  // Category handlers
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/category/delete/${id}`, {
        headers: { token },
      });
      fetchCategories();
    } catch (error) {
      console.error("Category delete failed:", error);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editedCategoryData.name) {
      setError("Category name is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editedCategoryData.name);
      if (editedCategoryData.imgFile) {
        formData.append("img", editedCategoryData.imgFile);
      }

      await axios.put(`http://localhost:3001/category/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      setEditingCategory(null);
      setEditedCategoryData({ name: "", imgFile: null, imgPreview: "" });
      fetchCategories();
    } catch (error) {
      console.error("Category update failed:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.imgFile) {
      setError("Please fill in all category fields and upload image.");
      return;
    }

    try {
      setAddingCategory(true);
      setError("");
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("img", newCategory.imgFile);

      await axios.post("http://localhost:3001/category/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      setNewCategory({ name: "", imgFile: null, imgPreview: "" });
      fetchCategories();
    } catch (error) {
      setError(
        "Failed to add category. " + (error?.response?.data?.message || "")
      );
    } finally {
      setAddingCategory(false);
    }
  };

  // Helpers for image preview in category add/edit
  const handleNewCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({
        ...newCategory,
        imgFile: file,
        imgPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleEditedCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedCategoryData({
        ...editedCategoryData,
        imgFile: file,
        imgPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category", newProduct.category);
      formData.append("imgCover", newProduct.imgCover);

      await axios.post("http://localhost:3001/product/add", formData, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });
      fetchProducts();
      setNewProduct({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        imgCover: null,
      });
    } catch (err) {
      console.error("Add product failed:", err);
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      const formData = new FormData();

      // Always send title, price, stock
      formData.append("title", editedProductData.title);
      formData.append("price", editedProductData.price);
      formData.append("stock", editedProductData.stock);

      // Conditionally send imgCover ONLY IF user selected a new file
      if (editedProductData.imgCover instanceof File) {
        formData.append("imgCover", editedProductData.imgCover);
      }

      await axios.put(`http://localhost:3001/product/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      setEditingProduct(null);
      setEditedProductData({});
      fetchProducts();
    } catch (err) {
      console.error("Update product failed:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/product/delete/${id}`, {
        headers: { token },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete product failed:", err);
    }
  };

  // Base URL to load category images, adjust if different
  const baseImageUrl = "http://localhost:3001/uploads/category/";

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Add User Section */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Add New User
        </Typography>
        {error && (
          <Typography color="error" mb={1}>
            {error}
          </Typography>
        )}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <TextField
            label="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddUser}
            disabled={addingUser}
          >
            {addingUser ? "Adding..." : "Add User"}
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Typography variant="h6" p={2}>
          Users
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  {editingUser === user._id ? (
                    <TextField
                      value={editedUserData.name || ""}
                      onChange={(e) =>
                        setEditedUserData({
                          ...editedUserData,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>
                  {editingUser === user._id ? (
                    <TextField
                      value={editedUserData.email || ""}
                      onChange={(e) =>
                        setEditedUserData({
                          ...editedUserData,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editingUser === user._id ? (
                    <TextField
                      value={editedUserData.role || ""}
                      onChange={(e) =>
                        setEditedUserData({
                          ...editedUserData,
                          role: e.target.value,
                        })
                      }
                    />
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>
                  {editingUser === user._id ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateUser(user._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingUser(user._id);
                        setEditedUserData({
                          name: user.name,
                          email: user.email,
                          role: user.role,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(user._id)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Coupon Section */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Add New Coupon
        </Typography>
        {error && (
          <Typography color="error" mb={1}>
            {error}
          </Typography>
        )}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Code"
            value={newCoupon.code}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, code: e.target.value })
            }
          />
          <TextField
            label="Discount"
            type="number"
            value={newCoupon.discount}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, discount: e.target.value })
            }
          />
          <TextField
            label="Expires"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newCoupon.expires}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, expires: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCoupon}
            disabled={addingCoupon}
          >
            {addingCoupon ? "Adding..." : "Add Coupon"}
          </Button>
        </Box>
      </Box>

      {/* Coupons Table */}
      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Typography variant="h6" p={2}>
          Coupons
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>
                  {editingCoupon === coupon._id ? (
                    <TextField
                      value={editedCouponData.code || ""}
                      onChange={(e) =>
                        setEditedCouponData({
                          ...editedCouponData,
                          code: e.target.value,
                        })
                      }
                    />
                  ) : (
                    coupon.code
                  )}
                </TableCell>
                <TableCell>
                  {editingCoupon === coupon._id ? (
                    <TextField
                      type="number"
                      value={editedCouponData.discount || ""}
                      onChange={(e) =>
                        setEditedCouponData({
                          ...editedCouponData,
                          discount: e.target.value,
                        })
                      }
                    />
                  ) : (
                    coupon.discount
                  )}
                </TableCell>
                <TableCell>
                  {editingCoupon === coupon._id ? (
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={editedCouponData.expires || ""}
                      onChange={(e) =>
                        setEditedCouponData({
                          ...editedCouponData,
                          expires: e.target.value,
                        })
                      }
                    />
                  ) : (
                    new Date(coupon.expires).toISOString().slice(0, 10)
                  )}
                </TableCell>
                <TableCell>
                  {editingCoupon === coupon._id ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateCoupon(coupon._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingCoupon(coupon._id);
                        setEditedCouponData({
                          code: coupon.code,
                          discount: coupon.discount,
                          expires: new Date(coupon.expires)
                            .toISOString()
                            .slice(0, 10),
                        });
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteCoupon(coupon._id)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Category Section */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Add New Category
        </Typography>
        {error && (
          <Typography color="error" mb={1}>
            {error}
          </Typography>
        )}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <Input
            type="file"
            onChange={handleNewCategoryImageChange}
            inputProps={{ accept: "image/*" }}
          />
          {newCategory.imgPreview && (
            <img
              src={newCategory.imgPreview}
              alt="Preview"
              style={{ width: 60, height: 60, objectFit: "cover" }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            disabled={addingCategory}
          >
            {addingCategory ? "Adding..." : "Add Category"}
          </Button>
        </Box>
      </Box>

      {/* Categories Table */}
      <TableContainer component={Paper}>
        <Typography variant="h6" p={2}>
          Categories
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category._id}</TableCell>
                <TableCell>
                  {editingCategory === category._id ? (
                    <TextField
                      value={editedCategoryData.name || ""}
                      onChange={(e) =>
                        setEditedCategoryData({
                          ...editedCategoryData,
                          name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>

                <TableCell>
                  {editingCategory === category._id ? (
                    <>
                      <Input
                        type="file"
                        onChange={handleEditedCategoryImageChange}
                        inputProps={{ accept: "image/*" }}
                      />
                      {editedCategoryData.imgPreview ? (
                        <img
                          src={editedCategoryData.imgPreview}
                          alt="Preview"
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                      ) : (
                        <img
                          src={category.img}
                          alt={category.name}
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                      )}
                    </>
                  ) : (
                    <img
                      src={category.img}
                      alt={category.name}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {editingCategory === category._id ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateCategory(category._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingCategory(category._id);
                        setEditedCategoryData({
                          name: category.name,
                          imgFile: null,
                          imgPreview: "",
                        });
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteCategory(category._id)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Add New Product
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Title"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <TextField
            label="Price"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <TextField
            label="Stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />
          <TextField
            label="Category ID"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
          <Input
            type="file"
            onChange={(e) =>
              setNewProduct({ ...newProduct, imgCover: e.target.files[0] })
            }
          />
          <Button variant="contained" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 6 }}>
        <Typography variant="h6" p={2}>
          Products
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>img</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  {editingProduct === product._id ? (
                    <TextField
                      value={editedProductData.title || ""}
                      onChange={(e) =>
                        setEditedProductData({
                          ...editedProductData,
                          title: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.title
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product._id ? (
                    <>
                      <Input
                        type="file"
                        onChange={(e) =>
                          setEditedProductData({
                            ...editedProductData,
                            imgCover: e.target.files[0],
                          })
                        }
                      />
                      <img
                        src={
                          editedProductData.imgCover
                            ? URL.createObjectURL(editedProductData.imgCover)
                            : product.imgCover
                        }
                        alt="cover"
                        style={{ width: 60, height: 60, objectFit: "cover" }}
                      />
                    </>
                  ) : (
                    <img
                      src={product.imgCover}
                      alt={product.title}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                  )}
                </TableCell>

                <TableCell>
                  {editingProduct === product._id ? (
                    <TextField
                      type="number"
                      value={editedProductData.price || ""}
                      onChange={(e) =>
                        setEditedProductData({
                          ...editedProductData,
                          price: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.price
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product._id ? (
                    <TextField
                      type="number"
                      value={editedProductData.stock || ""}
                      onChange={(e) =>
                        setEditedProductData({
                          ...editedProductData,
                          stock: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.stock
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct === product._id ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateProduct(product._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingProduct(product._id);
                        setEditedProductData({
                          title: product.title,
                          price: product.price,
                          stock: product.stock,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProduct(product._id)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
