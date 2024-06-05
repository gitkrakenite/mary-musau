import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSave } from "react-icons/ai";
import Logo from "../assets/Blogo.png";
import Reports from "../components/Reports";
import { useSelector } from "react-redux";
import { IoAdd } from "react-icons/io5";

const Home = () => {
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // read from state
  const [cartItemCount, setCartItemCount] = useState(0);
  useEffect(() => {
    // Function to count the number of items in localStorage
    const countItemsInCart = () => {
      try {
        // Retrieve the existing cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem("issues")) || [];
        // Get the number of items in the cart
        const itemCount = cartItems.length;
        // Update the state with the item count
        setCartItemCount(itemCount);
      } catch (error) {
        // Handle any errors that might occur during parsing or reading from localStorage
        console.error("Error reading from localStorage:", error);
      }
    };

    countItemsInCart(); // Call the function when the component mounts
  }, []);

  return (
    <div>
      {/* wrapper */}
      <div className=" w-[100%] sm:w-[90%] m-auto py-[3px] md:py-[1em] ">
        {/* navbar */}
        <div
          className="mb-[20px] my-[5px] p-[15px] bg-zinc-200 sm:rounded-2xl z-20"
          style={{
            // position: "-webkit-sticky",
            position: "sticky",
            top: 0,
          }}
        >
          <div className="flex justify-between items-center gap-[10px] ">
            <Link to="/">
              <div className="flex item-center flex-col">
                <div>
                  <img src={Logo} alt="" className="w-12 h-12" />
                </div>
              </div>
            </Link>
            <div className="flex gap-[24px]  md:gap-[60px] items-center">
              <Link to="/saved">
                <div className="relative">
                  <AiOutlineSave
                    className="text-3xl text-pink-600"
                    title="Saved"
                  />
                  <p
                    className="absolute bottom-[20px] left-[32px] z-[999]"
                    style={{ fontWeight: 700 }}
                  >
                    {cartItemCount}
                  </p>
                </div>
              </Link>

              <Link to="/new-issue" onClick={() => setToggleDrawer(false)}>
                <p
                  className="text-zinc-500 hover:text-teal-800"
                  style={{ fontWeight: 500 }}
                >
                  <IoAdd className="text-3xl text-pink-600" title="Add" />
                </p>
              </Link>

              <Link to="/account" onClick={() => setToggleDrawer(false)}>
                <img
                  src={user?.profile}
                  className="w-[50px] h-[50px] rounded-full object-cover"
                  alt=""
                />
              </Link>
            </div>
          </div>
        </div>

        {/*  */}
        {/* main content */}
        <div className=" px-[10px] lg:px-[20px]">
          <div></div>
          <div>
            <Reports />
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default Home;
