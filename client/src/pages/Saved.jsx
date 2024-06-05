import React, { useEffect, useState } from "react";
import {
  AiOutlineArrowUp,
  AiOutlineClear,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/Blogo.png";
import moment from "moment";

const Saved = () => {
  // scroll to top functionality
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // fetch products from localstorage
  const [issues, setIssues] = useState([]);
  function getSortedIssuesFromLocalStorage() {
    // Retrieve the cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("issues")) || [];

    // Sort the cart items in reverse order based on the timestamp or any other relevant property
    const sortedCartItems = cartItems.sort((a, b) => b.timestamp - a.timestamp);

    // Update the cart state with the sorted Issues
    setIssues(sortedCartItems);
  }

  useEffect(() => {
    getSortedIssuesFromLocalStorage();
  }, []);

  const clearAllSaved = () => {
    localStorage.clear("issues");
    getSortedIssuesFromLocalStorage();
  };

  const handleRemoveFromSaved = (id) => {
    // Retrieve the cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("issues")) || [];

    // Filter out the product with the specified ID
    const updatedCartItems = cartItems.filter((item) => item._id !== id);

    setIssues(updatedCartItems);

    localStorage.setItem("issues", JSON.stringify(updatedCartItems));
    getSortedIssuesFromLocalStorage();
    // Update the cart item count in the parent component
    // setCartItemCount((prevCount) => prevCount - 1);
    toast.success("Removed From Saved");
  };

  return (
    <div>
      {/* wrapper */}
      <div>
        {/* arrow to scroll to top */}
        {showArrow && (
          <div
            className="fixed bottom-20 right-4 text-3xl z-[999] cursor-pointer bg-red-700 text-zinc-50 rounded-full p-[5px]"
            onClick={handleScrollTop}
          >
            <AiOutlineArrowUp />
          </div>
        )}
      </div>
      {/* topbar */}
      <div className=" w-full h-full top-0  text-white px-[10px] sm:px-[1em] md:px-[3em] lg:px-[4em] xl:px-[5em]  ">
        <div className="flex justify-between items-center">
          {/* logo */}
          <div>
            <Link to="/">
              <img src={logo} alt="" className="h-20 w-20 object-contain" />
            </Link>
          </div>
          <div>
            <AiOutlineClear
              title="clear all"
              className="text-3xl text-pink-600 cursor-pointer"
              onClick={() => clearAllSaved()}
            />
          </div>
        </div>
      </div>
      {/* display cart items */}
      <div className=" px-[10px] sm:px-[3em]">
        {issues.length < 1 ? (
          <div className="my-[10em]">
            <h2 className="mb-[10px] text-center">
              You Have Not Saved Anything Yet
            </h2>
            <Link to="/">
              <p className="text-pink-500 underline text-center">Back Home</p>
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-[2em]">
              {/* {console.log(issues)} */}
              {issues?.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-200 rounded-lg mb-[20px] px-1"
                >
                  <Link to={`/issue/${item._id}`}>
                    <div className="rounded-lg flex items-center justify-between gap-[20px] flex-wrap">
                      <div className=" flex gap-[30px] sm:gap-[80px]   justify-between items-center">
                        <div>
                          <img
                            src={item.photo}
                            alt=""
                            style={{
                              height: "100px",
                              width: "auto",
                              objectFit: "contain",
                            }}
                          />
                        </div>

                        <div>
                          <div>
                            <p className=" mb-[5px]">{item.title}</p>
                            <p className=" mb-[5px]">#{item.category}</p>
                            <p className="text-sm text-teal-700">
                              {moment(item.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full flex justify-end">
                        <p
                          className="text-orange-800 text-xl cursor-pointer"
                          onClick={() => handleRemoveFromSaved(item._id)}
                        >
                          <AiOutlineCloseCircle
                            title="Remove From Saved"
                            className="text-2xl"
                          />
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/*  */}
    </div>
  );
};

export default Saved;
