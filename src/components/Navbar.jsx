import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../App";

const Navbar = () => {
  const { isLoggedIn, role, userName, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuth({ isLoggedIn: false, role: "", userName: "" });
    navigate("/login");
  };

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 items-center justify-between">
      <div className="flex gap-4">
        <Link to="/" className="font-medium hover:text-blue-600">Home</Link>
        <Link to="/products" className="font-medium hover:text-blue-600">Products</Link>
        <Link to="/details" className="font-medium hover:text-blue-600">Categories</Link>
        <Link to="/about" className="font-medium hover:text-blue-600">About</Link>
        <Link to="/contact" className="font-medium hover:text-blue-600">Contact</Link>

        {isLoggedIn && role === "admin" && (
          <Link to="/admin/dashboard" className="font-medium hover:text-blue-600">Dashboard</Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {!isLoggedIn && (
          <>
            <Link to="/login" className="font-medium hover:text-blue-600">Login</Link>
            <Link to="/signup" className="font-medium hover:text-blue-600">Sign Up</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <span className="font-medium text-gray-800">Hello, {userName}</span>
            <button
              onClick={handleLogout}
              className="font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
