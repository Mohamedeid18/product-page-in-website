import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import DetailsProductsPage from "./pages/DetailsProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/dashboard/Users";
import Orders from "./pages/dashboard/Orders";
import Notfound from "./pages/Notfound";
import Footer from "./components/Footer";
import { createContext, useState, useEffect } from "react";
import axios from "axios";


export const AuthContext = createContext();

const App = () => {
  // Initialize auth state from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Auth state
  const [auth, setAuth] = useState({
    isLoggedIn: storedUser ? true : false,
    role: storedUser?.role || "",
    userName: storedUser?.userName || "",
  });
  // Persist auth state from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAuth({
        role: user.role,
        isLoggedIn: true,
        userName: user.userName || "",
      });
    }
  }, []);

  // Products state and fetching
 
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/items"
        );
        const data = await res.data;

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const onViewDetails = (product) => {
    alert(`Viewing details for ${product.name}`);
  };
  const handleAddToCart = (product) => {
    if (!auth.isLoggedIn) {
      alert("You must be logged in to add items to the cart.");
      return;
    }
    alert(`${product.name} added to cart!`);
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={<ProductsPage products={products} loadingProducts={loadingProducts} handleAddToCart={handleAddToCart} onViewDetails={onViewDetails} />}
        />
        <Route path="/details" element={<DetailsProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {!auth.isLoggedIn && (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </>
        )}

        <Route
          path="/admin/dashboard/*"
          element={
            auth.isLoggedIn && auth.role === "admin" ? <Dashboard /> : <Navigate to="/" />
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer />
    </AuthContext.Provider>
  );
};

export default App;