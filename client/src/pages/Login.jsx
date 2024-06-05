import React, { useEffect, useState } from "react";
import Logo from "../assets/Blogo.png";
import { BiSolidPhoneCall } from "react-icons/bi";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { login, reset } from "../features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error("Please Check Login Details");
      toast.error("Also Check Network");
    }

    if (user) {
      navigate("/");
      // toast.success("Welcome Back");
    }

    if (navigator.onLine) {
      console.log("online");
    } else {
      toast.error("Network Error");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, isLoading, navigate, dispatch]);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("email needed");
    if (!password) return toast.error("Password needed");

    try {
      setLoading(true);
      const userData = { email, password };
      await dispatch(login(userData));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to sign you in");
    }
  };

  return (
    <div className="w-full h-[100vh]">
      <img
        src="https://images.pexels.com/photos/963278/pexels-photo-963278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Background Placeholder"
        className="w-full h-[100vh] object-cover imageHolder"
      />

      {/* overlay div */}
      <div className="absolute top-0 left-0 w-full h-[100vh] bg-[rgba(0,0,0,.9)]" />

      {/* form content */}
      <div className="absolute w-full h-[100vh] top-0 flex flex-col justify-center items-center text-white ">
        {/* wrapper */}
        <div className="px-[10px] lg:px-[2em] pt-[1em] w-full">
          {/* form */}
          <div>
            <form
              className=" w-[98%] sm:w-[75%]  md:w-[60%] lg:w-[25%] m-auto"
              onSubmit={handleLogin}
            >
              <div>
                {/* topbar */}
                <div className="flex justify-center mb-6 items-center">
                  <Link to="/">
                    <div className="flex justify-center mb-2 items-center">
                      <img src={Logo} alt="" className="w-[80px] mb-6" />
                    </div>
                    <p className="text-xl font-semibold">Please Login</p>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-[10px] mb-[28px]">
                <label htmlFor="email" className="font-bold text-zinc-300">
                  Enter Your Email Address
                </label>
                <input
                  type="email"
                  placeholder="xxxxx@gmail.com"
                  id="email"
                  className="bg-transparent border outline-none border-pink-600 p-[8px] rounded-lg"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-[10px] mb-[20px]">
                <label
                  htmlFor="password"
                  className="font-bold text-zinc-300 outline-none"
                >
                  Enter Your Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  id="password"
                  className="bg-transparent border outline-none border-pink-600 p-[8px] rounded-lg"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-[20px]">
                {loading ? (
                  <>
                    <Spinner message="Verifying" />
                  </>
                ) : (
                  <button
                    className="backgroundBG text-white p-[10px] w-full rounded-md"
                    onClick={handleLogin}
                  >
                    Log in
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Link to="/register" className="underline">
                    New here ?
                  </Link>
                </div>
                <div className="flex gap-[5px] items-center hover:text-pink-700 cursor-pointer">
                  <a href="tel:+254 740 775569">
                    <BiSolidPhoneCall className="text-2xl" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default Login;
