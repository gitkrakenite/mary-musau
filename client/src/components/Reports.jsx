import {
  AiOutlineArrowRight,
  AiOutlineArrowUp,
  AiOutlineComment,
  AiOutlineLike,
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineSave,
} from "react-icons/ai";
import {
  MdBugReport,
  MdOutlineAddBusiness,
  MdVerifiedUser,
} from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { FaRegSadCry } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import { useEffect, useState } from "react";
import "../masonry.css";

import { toast } from "react-toastify";
import axios from "../axios";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import { DummyCategory } from "../DummyData";
import moment from "moment";

const Reports = () => {
  const { state } = useLocation();
  useEffect(() => {
    if (state && state.scrollPosition !== undefined) {
      // Scroll to the previously saved position
      window.scrollTo(0, state.scrollPosition);
    }
  }, [state]);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/report/all");
      if (response) {
        setLoading(false);
        setAllReports(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error Fetching Reports");
    }
  };

  useEffect(() => {
    handleFetchReports();
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    3000: 5,
    2000: 3,
    1200: 2,
    700: 1,
  };

  //   pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allReports?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allReports?.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(4);

  const handleClick = (number) => {
    setStart(number);
    setEnd(number + 3);
  };

  const prevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      handleClick(currentPage);
    }
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
      handleClick(currentPage);
    }
  };

  const changeCurrentPage = (id) => {
    setCurrentPage(id);
  };

  // search  states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setsearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  // search user func
  const handleSearchChange = async (e) => {
    e.preventDefault();
    clearTimeout(setsearchTimeout);

    setSearchText(e.target.value);

    // console.log(searchText);

    setsearchTimeout(
      setTimeout(() => {
        const searchResults = allReports?.filter(
          (item) =>
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.fixer.toLowerCase().includes(searchText.toLowerCase()) ||
            item.location.toLowerCase().includes(searchText.toLowerCase())
        );

        setSearchedResults(searchResults);
      }, 500)
    );
  };

  // scroll to top functionality
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 600) {
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

  // handle user backgroun colors
  const getRandomColorClass = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-700",
      "bg-yellow-700",
      "bg-orange-700",
      "bg-purple-500",
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const [backgroundClass, setBackgroundClass] = useState(getRandomColorClass());

  const changeBackgroundColor = () => {
    setBackgroundClass(getRandomColorClass());
  };

  useEffect(() => {
    const intervalId = setInterval(changeBackgroundColor, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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

  const [issueItemCount, setIssueItemCount] = useState(0);
  const handleSave = async (issue) => {
    // Retrieve the existing cart items from localStorage
    const issueItems = JSON.parse(localStorage.getItem("issues")) || [];

    // Check if the product already exists in the cart
    const exisitingIssue = issueItems.find((item) => item._id === issue._id);

    if (exisitingIssue) {
      // Product already exists, return a message
      toast.error("Already Saved");
      return;
    }

    // Merge the product and extraData into a new object
    const issueWithExtraData = { ...issue };

    // Create a new cart with the existing items and the new product
    const updatedCart = [...issueItems, issueWithExtraData];

    // Update the cart items in localStorage
    localStorage.setItem("issues", JSON.stringify(updatedCart));

    // Update the cart item count in the parent component
    setIssueItemCount((prevCount) => prevCount + 1);

    toast.success(`${issue.title} saved`);
    return;
  };

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      {/* arrow to scroll to top */}
      {showArrow && (
        <div
          className="fixed bottom-20 right-4 text-3xl z-[999] cursor-pointer bg-teal-800 text-zinc-50 rounded-full p-[5px]"
          onClick={handleScrollTop}
        >
          <AiOutlineArrowUp />
        </div>
      )}

      {/* search bar */}
      <div className=" w-full mt-[10px]">
        {/* searchbar */}
        <div className="w-full flex justify-center">
          <form className=" w-[98%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] bg-transparent flex gap-[5px] items-center p-[8px] rounded-xl border border-pink-700">
            <AiOutlineSearch className="text-xl text-pink-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full "
              required
              // maxLength={15}
              // minLength={2}
              value={searchText}
              onChange={handleSearchChange}
            />
          </form>
        </div>
      </div>

      {/* wrapper */}

      <div>
        {/* categories */}
        {!searchText && (
          <div className="mt-10 text-zinc-600">
            <div className="mb-[15px] flex md:hidden items-center gap-2">
              <p className="">SCROLL TO FILTER</p>
              <p>
                <AiOutlineArrowRight />
              </p>
            </div>
            <div className=" overflow-x-scroll prompt">
              <div className="flex sm:justify-center ">
                <ul className="flex  space-x-7  pb-1 ">
                  <li
                    className="cursor-pointer flex items-center gap-1 hover:text-pink-500"
                    onClick={handleFetchReports}
                  >
                    <MdOutlineAddBusiness />
                    all
                  </li>

                  {DummyCategory?.map((item) => (
                    <li
                      key={item._id}
                      className="cursor-pointer flex items-center gap-1 hover:text-pink-500"
                      onClick={async () => {
                        setShowFilters(false);
                        setLoading(true);
                        let category = item.title;
                        let dataToSend = { category };
                        try {
                          const response = await axios.post(
                            "/report/cat",
                            dataToSend
                          );
                          if (response) {
                            setLoading(false);

                            setAllReports(response.data);
                            // console.log(response.data);
                          }
                        } catch (error) {
                          setLoading(false);
                          toast.error("Failed to find " + item.title);
                        }
                      }}
                    >
                      <MdBugReport />
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-[5px]">
          {/* reports */}
          <div className="mt-[15px]">
            {searchText ? (
              <>
                <div className="mb-[15px] text-zinc-400">
                  {searchText && <p>Results For : {searchText}</p>}
                </div>

                {searchedResults?.length > 0 ? (
                  <div>
                    <Masonry
                      breakpointCols={breakpointColumnsObj}
                      className="my-masonry-grid "
                      columnClassName="my-masonry-grid_column"
                    >
                      {searchedResults?.map((item) => (
                        <div
                          key={item._id}
                          className=" mb-[20px]   p-2 rounded-lg"
                        >
                          <div>
                            <Link to={`/issue/${item._id}`}>
                              {/* photo */}
                              <div className="w-full flex justify-center ">
                                <img
                                  src={item.photo}
                                  className="w-[100%] h-[180px] object-cover rounded-tr-xl rounded-tl-xl"
                                  alt=""
                                />
                              </div>

                              <div className="border px-2 py-2 rounded-bl-lg rounded-br-lg border-pink-500">
                                {/* toppart */}
                                <div className="flex gap-4 items-center mb-5">
                                  <div className="flex gap-[15px] items-center">
                                    <p
                                      className={`w-10 h-10 flex items-center justify-center rounded-full bg-pink-800 text-white`}
                                    >
                                      {item.creator.substring(0, 2)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-zinc-600 font-semibold  text-md">
                                      {item.title.length > 22
                                        ? `${item.title.substring(0, 22)} ....`
                                        : item.title}
                                    </p>
                                  </div>
                                </div>

                                <p className="mb-[10px]">
                                  {item.description.substring(0, 100)}...
                                </p>

                                <div className=" flex flex-col gap-[10px] mb-[10px]">
                                  <div className="flex items-center gap-[20px] flex-wrap justify-between">
                                    <div>
                                      {!item.resolved ? (
                                        <>
                                          <div className="flex gap-[5px] items-center text-pink-700">
                                            <FaRegSadCry />
                                            <p>Not Resolved</p>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="flex gap-[5px] items-center text-green-700">
                                          <MdVerifiedUser />

                                          <p>Resolved after</p>
                                          <p>
                                            {moment
                                              .duration(
                                                moment(item.updatedAt).diff(
                                                  moment(item.createdAt)
                                                )
                                              )
                                              .humanize()}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex gap-[25px] items-center">
                                      <div className="flex items-center gap-[10px]">
                                        <AiOutlineComment className="text-2xl text-pink-700" />
                                        <p>{item.comments.length}</p>
                                      </div>
                                      <div className="flex items-center gap-[10px]">
                                        <AiOutlineArrowUp
                                          className="text-2xl text-pink-700"
                                          title="upvote"
                                        />
                                        <p>{item.likes.length}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div className="flex justify-between items-center text-zinc-700 mt-[10px] ">
                            <AiOutlineSave
                              className="text-pink-700 text-2xl cursor-pointer"
                              onClick={() => handleSave(item)}
                              title="save for later"
                            />
                            <div className="flex gap-[20px] items-center">
                              <p className=" text-sm text-pink-700">
                                {moment(item.createdAt).fromNow()}
                              </p>
                            </div>
                          </div>

                          {/*  */}
                        </div>
                      ))}
                    </Masonry>
                  </div>
                ) : (
                  <div className="w-full h-[65vh] flex justify-between items-center">
                    <p className="text-center w-full justify-center flex">
                      😥No results for :
                      <span className="text-red-600">{searchText}</span>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {loading ? (
                  <div className="mt-[8em]">
                    <Spinner message="Fetching ..." />
                  </div>
                ) : (
                  <>
                    {records.length < 1 ? (
                      <div className="mt-[4em] text-center">
                        <p className="mb-3">Hello 👋 No Reports Found</p>

                        <Link to="/new-issue">
                          <p className="text-pink-600 underline">
                            Create One ?
                          </p>
                        </Link>
                      </div>
                    ) : (
                      <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid "
                        columnClassName="my-masonry-grid_column"
                      >
                        {records?.map((item) => (
                          <div
                            key={item._id}
                            className=" mb-[20px]   p-2 rounded-lg"
                          >
                            <div>
                              <Link to={`/issue/${item._id}`}>
                                {/* photo */}
                                <div className="w-full flex justify-center ">
                                  <img
                                    src={item.photo}
                                    className="w-[100%] h-[180px] object-cover rounded-tr-xl rounded-tl-xl"
                                    alt=""
                                  />
                                </div>

                                <div className="border px-2 py-2 rounded-bl-lg rounded-br-lg border-pink-500">
                                  {/* toppart */}
                                  <div className="flex gap-4 items-center mb-5">
                                    <div className="flex gap-[15px] items-center">
                                      <p
                                        className={`w-10 h-10 flex items-center justify-center rounded-full bg-pink-800 text-white`}
                                      >
                                        {item.creator.substring(0, 2)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-zinc-600 font-semibold  text-md">
                                        {item.title.length > 22
                                          ? `${item.title.substring(
                                              0,
                                              22
                                            )} ....`
                                          : item.title}
                                      </p>
                                    </div>
                                  </div>

                                  <p className="mb-[10px]">
                                    {item.description.substring(0, 100)}...
                                  </p>

                                  <div className=" flex flex-col gap-[10px] mb-[10px]">
                                    <div className="flex items-center gap-[20px] flex-wrap justify-between">
                                      <div>
                                        {!item.resolved ? (
                                          <>
                                            <div className="flex gap-[5px] items-center text-pink-700">
                                              <FaRegSadCry />
                                              <p>Not Resolved</p>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex gap-[5px] items-center text-green-700">
                                            <MdVerifiedUser />

                                            <p>Resolved after</p>
                                            <p>
                                              {moment
                                                .duration(
                                                  moment(item.updatedAt).diff(
                                                    moment(item.createdAt)
                                                  )
                                                )
                                                .humanize()}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex gap-[25px] items-center">
                                        <div className="flex items-center gap-[10px]">
                                          <AiOutlineComment className="text-2xl text-pink-700" />
                                          <p>{item.comments.length}</p>
                                        </div>
                                        <div className="flex items-center gap-[10px]">
                                          <AiOutlineArrowUp
                                            className="text-2xl text-pink-700"
                                            title="upvote"
                                          />
                                          <p>{item.likes.length}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>

                            <div className="flex justify-between items-center text-zinc-700 mt-[10px] ">
                              <AiOutlineSave
                                className="text-pink-700 text-2xl cursor-pointer"
                                onClick={() => handleSave(item)}
                                title="save for later"
                              />
                              <div className="flex gap-[20px] items-center">
                                <p className=" text-sm text-pink-700">
                                  {moment(item.createdAt).fromNow()}
                                </p>
                              </div>
                            </div>

                            {/*  */}
                          </div>
                        ))}
                      </Masonry>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* end wrapper */}
    </div>
  );
};

export default Reports;
