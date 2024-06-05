import React, { useEffect, useState } from "react";
import Logo from "../assets/Blogo.png";
import { BiSolidPhoneCall } from "react-icons/bi";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { register, reset } from "../features/auth/authSlice";
import imageCompression from "browser-image-compression";
import axios from "../axios";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
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

  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const postPhoto = async (pic) => {
    if (pic === null || undefined) {
      toast.error("Please select photo", { theme: "dark" });
      return;
    }

    // Compress the image
    const options = {
      maxSizeMB: 1, // Adjust the maximum size of the compressed image
      maxWidthOrHeight: 1920, // Adjust the maximum width or height of the compressed image
      useWebWorker: true, // Use Web Worker for better performance
    };

    try {
      setLoadingPhoto(true);
      const compressedFile = await imageCompression(pic, options);
      const data = new FormData();
      data.append("file", compressedFile);
      data.append("upload_preset", "p2jnu3t2");
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/ddqs3ukux/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const urlData = await res.json();
      setLoadingPhoto(false);
      setProfile(urlData.url);
      toast.success("Uploaded Photo", { theme: "dark" });
    } catch (error) {
      setLoadingPhoto(false);
      toast.error("Error uploading Photo", { theme: "dark" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName) return toast.error("name needed");
    if (!email) return toast.error("Email needed");
    if (!profile) return toast.error("Profile needed");
    if (!phone) return toast.error("Phoen needed");
    if (!password) return toast.error("Password needed");

    //verify username
    if (fullName.length < 3 || fullName.length > 20) {
      toast.warning("fullName between 3 - 20 letters", { theme: "dark" });
      return;
    }
    const containsNumbers = /[0-9]/.test(fullName);
    if (containsNumbers)
      return toast.error("Your Name cannot have numbers.", { theme: "dark" });

    //verify phone number accuracy
    if (phone.length < 8)
      return toast.error("Phone number incomplete", { theme: "dark" });
    const containsLetters = /[a-zA-Z]/.test(phone);
    if (containsLetters)
      return toast.error("Phone cannot have letters.", { theme: "dark" });

    //verify that it is gmail.com
    if (email.length < 12)
      return toast.error("Email incomplete", { theme: "dark" });
    let verifyEmail = email.includes("gmail.com");
    if (verifyEmail === false) {
      toast.error("Enter A Valid Gmail address", { theme: "dark" });
      toast.warning("xxx@gmail.com", { theme: "dark" });
      return;
    }

    try {
      setLoading(true);
      // check whether email already exists
      const emailToCheck = { email };
      const { data } = await axios.post("/users/check", emailToCheck);

      if (data === "not exist") {
        let role = "test";
        const userData = {
          fullName,
          role,
          email,
          profile,
          phone,
          password,
        };
        dispatch(register(userData));
        setLoading(false);
        return;
      } else {
        toast.error(`A user with this email exists.`, { theme: "dark" });
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create account");
    }
  };

  return (
    <div className="w-full h-[100vh] overflow-y-scroll">
      <img
        src="https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Background Placeholder"
        className="w-full h-full object-cover imageHolder"
      />

      {/* overlay div */}
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,.8)]" />

      {/* form content */}
      <div className="absolute w-full h-[100vh] py-3 overflow-y-scroll top-0 flex flex-col justify-center items-center text-white ">
        {/* wrapper */}
        <div className="px-[10px] lg:px-[2em] pt-[1em] w-full">
          {/* form */}
          <div className="mt-[1%] w-full">
            <form
              className=" w-[98%] sm:w-[75%]  md:w-[60%] lg:w-[38%] m-auto"
              onSubmit={handleRegister}
            >
              <div>
                {/* topbar */}
                <div className="flex justify-center mb-8 items-center">
                  <Link to="/">
                    <div className="flex justify-center mb-2 items-center">
                      <img src={Logo} alt="" className="w-[80px] mb-6" />
                    </div>
                    <p className="text-xl font-semibold">Create New Account</p>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-[10px] mb-[20px]">
                <label htmlFor="name" className="font-bold text-zinc-300">
                  Enter Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="name here"
                  id="name"
                  className=" bg-transparent border outline-none border-pink-600 p-[8px] rounded-lg"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              {/* email */}
              <div className="flex flex-col gap-[10px] mb-[20px]">
                <label htmlFor="email" className="font-bold text-zinc-300">
                  Enter Your Email Address
                </label>
                <input
                  type="email"
                  placeholder="xxxxxxx@gmail.com"
                  id="email"
                  className="bg-transparent border outline-none border-pink-600 p-[8px] rounded-lg"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* upload image */}
              <div className="flex flex-col items-start gap-[20px] sm:gap-0 sm:flex-row sm:items-center mt-[20px] mb-[20px]  px-[5px] rounded-lg">
                <div className="flex flex-col gap-2 mt-[20px]">
                  <label
                    htmlFor="profile"
                    className="flex items-center gap-[20px] flex-wrap"
                  >
                    <p>Upload Your Profile</p>
                    <div className="flex flex-col items-center">
                      {loadingPhoto ? (
                        <Spinner message="uploading ..." />
                      ) : (
                        <img
                          src={
                            profile
                              ? profile
                              : "https://images.pexels.com/photos/8834489/pexels-photo-8834489.jpeg?auto=compress&cs=tinysrgb&w=400"
                          }
                          alt=""
                          className="w-[100px] h-[100px] object-cover rounded-md"
                        />
                      )}
                    </div>
                  </label>
                  <input
                    type="file"
                    placeholder="Add Image"
                    accept="image/*"
                    onChange={(e) => postPhoto(e.target.files[0])}
                    required
                    id="profile"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[10px] mb-[20px]">
                <label htmlFor="phone" className="font-bold text-zinc-300">
                  Enter Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+254 xxxxxxx"
                  id="phone"
                  className="bg-transparent border outline-none border-pink-600 p-[8px] rounded-lg"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-[10px] mb-[20px]">
                <label htmlFor="password" className="font-bold text-zinc-300">
                  Create A Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  id="password"
                  className="bg-transparent outline-none border border-pink-600 p-[8px] rounded-lg"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-[20px]">
                {isLoading || loading || loadingPhoto ? (
                  <p className="text-center">Please Wait 😃 ...</p>
                ) : (
                  <button
                    style={{ fontWeight: 600, letterSpacing: "1px" }}
                    onClick={handleRegister}
                    className="backgroundBG w-full text-white p-[8px] rounded-lg"
                  >
                    Create Account
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Link to="/login" className="underline">
                    Have An Account ?
                  </Link>
                </div>
                <div className="flex gap-[5px] items-center hover:text-pink-700 cursor-pointer">
                  <a href="tel:+254 740 775569">
                    <BiSolidPhoneCall className="text-xl" />
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

export default Register;
