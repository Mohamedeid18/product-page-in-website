import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Button, Input, Typography, Card } from "@material-tailwind/react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../App";

const LoginPage = () => {
  const { setAuth } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

  // Validation functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let valid = true;

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email");
      valid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include a number"
      );
      valid = false;
    }

    if (!valid) return;

    // Login logic
    const url =
      "https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/users";

    try {
      const response = await axios.get(url);
      const users = response.data;

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!user) {
        setLoginError("Invalid email or password");
        return;
      }

      const role =
        user.role || (user.email === "admin@example.com" ? "admin" : "user");

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, role, userName: user.userName })
      );

      setAuth({ isLoggedIn: true, role, userName: user.userName });

      role === "admin" ? navigate("/admin/dashboard") : navigate("/");
    } catch (err) {
      console.error(err);
      setLoginError("Login failed, try again later");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 pt-4">
      <section className="my-6 p-8 rounded-lg shadow-lg bg-white">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Sign In
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter your email and password to sign in
          </Typography>

          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            onSubmit={handleLogin}
          >
            {/* EMAIL */}
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Your Email
            </Typography>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            {emailError && (
              <span className="text-red-500 text-sm">{emailError}</span>
            )}
            {/* PASSWORD */}
            <Typography variant="h6" color="blue-gray" className="mb-3 mt-4">
              Password
            </Typography>{" "}
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                size="lg"
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && (
              <span className="text-red-500 text-sm">{passwordError}</span>
            )}
            {/* Login Error */}
            {loginError && (
              <span className="text-red-500 text-sm mb-4 block">
                {loginError}
              </span>
            )}
            <Button
              color="gray"
              size="lg"
              fullWidth
              type="submit"
              className="mt-5"
            >
              Sign In
            </Button>
            <div className="!mt-4 flex justify-end">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-blue-gray-600 font-medium text-sm"
              >
                Forgot password
              </a>
            </div>
            <p className="!mt-4 text-center text-gray-500 text-sm">
              Not registered?{" "}
              <Link to="/signup" className="font-medium text-gray-900">
                Create account
              </Link>
            </p>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default LoginPage;
