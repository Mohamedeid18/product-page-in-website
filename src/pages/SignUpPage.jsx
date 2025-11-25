import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    checkbox: "",
    submit: "",
  });

  // نفس validation الموجود في كود الفايربيز
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      checkbox: "",
      submit: "",
    };

    // --- NAME VALIDATION ---
    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // --- EMAIL VALIDATION ---
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    // --- PASSWORD VALIDATION ---
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!isValidPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include a number";
      valid = false;
    }

    // --- AGREE VALIDATION ---
    if (!agree) {
      newErrors.checkbox = "You must agree to Terms and Conditions";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      // check if email already exists
      const { data: existingUsers } = await axios.get(
        "https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/users"
      );

      const emailUsed = existingUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );

      if (emailUsed) {
        setErrors((prev) => ({ ...prev, email: "Email is already used" }));
        return;
      }

      const postData = {
        id: Math.floor(Math.random() * 1000),
        userName: name,
        email,
        password,
        role: "user",
      };

      await axios.post(
        "https://be4dc6ae-aa83-48a5-a3ca-8f2474a803f6-00-2bqlvnxatc3lz.spock.replit.dev/users",
        postData
      );

      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        submit: "Sign up failed. Try again later.",
      }));
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 pt-4">
      <section className="my-6 p-8 rounded-lg shadow-lg bg-white">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Nice to meet you! Enter your details to register.
          </Typography>

          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            onSubmit={handleSignUp}
          >
            <div className="mb-1 flex flex-col gap-6">
              {/* NAME */}
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Name
              </Typography>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="lg"
                placeholder="userName"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}

              {/* EMAIL */}
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                placeholder="name@mail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}

              {/* PASSWORD */}
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                size="lg"
                placeholder="********"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>

            {/* TERMS CHECKBOX */}
            <Checkbox
              checked={agree}
              onClick={() => setAgree(!agree)}
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />

            {errors.checkbox && (
              <div>
                <span className="text-red-500 text-sm">{errors.checkbox}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <Button className="mt-6" fullWidth type="submit">
              Sign Up
            </Button>

            {errors.submit && (
              <p className="text-red-500 text-center mt-4">{errors.submit}</p>
            )}

            <Typography color="gray" className="mt-4 text-center font-normal">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-gray-900">
                Sign In
              </Link>
            </Typography>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default SignUpPage;
