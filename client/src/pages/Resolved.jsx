import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import axios from "../axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  AiOutlineArrowUp,
  AiOutlineComment,
  AiOutlineEye,
  AiOutlineSearch,
} from "react-icons/ai";
import Masonry from "react-masonry-css";
import { CiLocationOn } from "react-icons/ci";
import { BsFillPersonFill } from "react-icons/bs";
import { FaRegSadCry } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import moment from "moment";
import Spinner from "../components/Spinner";

const Resolved = () => {
  const [allResolved, setAllResolved] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleFetchResolved = async () => {
    try {
      setLoading(true);
      let resolved = "yes";
      let dataToSend = { resolved };
      const response = await axios.post("/report/resolved", dataToSend);
      if (response) {
        setLoading(false);
        setAllResolved(response.data);
        console.log(response.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error Fetching Resolved");
    }
  };

  useEffect(() => {
    handleFetchResolved();
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
  const records = allResolved?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allResolved?.length / recordsPerPage);
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
        const searchResults = allResolved?.filter(
          (item) =>
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.searchTerms.toLowerCase().includes(searchText.toLowerCase())
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

  const handleAddViews = async (id) => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      let campusID = user.campusID;
      let viewsData = { campusID };

      await axios.post("/report/view/" + id, viewsData);
    } catch (error) {
      console.log(error);
    }
  };

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
      {/* wrapper */}
      <div className=" px-[10px] sm:px-[1em]  md:px-[3em] lg:px-[5em] pt-[1em]">
        <div>
          {/* top bar */}
          <div>
            <Link to="/home" className="flex items-center gap-[6px]">
              <IoChevronBackOutline />
              Back
            </Link>
          </div>
          {/* searchbar */}
          <div className="w-full flex justify-center">
            <form className=" w-[98%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] bg-zinc-300 flex gap-[5px] items-center p-[8px] rounded-xl">
              <AiOutlineSearch className="text-xl" />
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
          {/* pagination */}
          <div>
            {!searchText && allResolved.length > 0 && (
              <nav className="flex justify-center">
                <ul className="flex gap-[2em] mt-[5px] px-[5px] py-[10px] items-center ">
                  {/* map */}

                  <>
                    <li>
                      <a href="#" onClick={prevPage} className="text-zinc-800">
                        <p className="text-zinc-500 font-bold hover:text-zinc-900">
                          Prev
                        </p>
                      </a>
                    </li>
                    <li className="flex gap-[10px] ">
                      {numbers.slice(start - 1, end).map((item, index) => (
                        <li
                          key={index}
                          className={`normal-nav ${
                            currentPage === item && "active-nav"
                          }`}
                        >
                          <a
                            href="#"
                            onClick={() => {
                              handleClick(item);
                              changeCurrentPage(item);
                            }}
                          >
                            <p className="">{item}</p>
                          </a>
                        </li>
                      ))}
                    </li>

                    <li>
                      <a href="#" onClick={nextPage}>
                        <p className="text-zinc-500 font-bold hover:text-zinc-900">
                          Next
                        </p>
                      </a>
                    </li>
                  </>
                </ul>
              </nav>
            )}
          </div>
          {/* data */}
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
                          className="mb-[20px] bg-zinc-100  p-2 rounded-lg"
                        >
                          <div>
                            <Link to={`/issue/${item._id}`}>
                              <div className="flex gap-[15px] items-center mb-[10px]">
                                <p
                                  className={`w-10 h-10 flex items-center justify-center rounded-full ${backgroundClass} text-white`}
                                >
                                  {item.creator.substring(0, 2)}
                                </p>
                                <p className="text-zinc-900 font-bold text-md">
                                  {item.title.substring(0, 22)} ...
                                </p>
                              </div>

                              <div className="flex gap-[10px] items-center justify-end mb-[10px]">
                                <CiLocationOn />
                                <p>{item.location}</p>
                              </div>
                              <div>
                                <p className="mb-[10px]">
                                  {item.description.substring(0, 100)}...
                                </p>

                                <div className=" flex flex-col gap-[10px] mb-[10px]">
                                  <div>
                                    <h2 className="mb-[5px] font-bold text-zinc-600">
                                      Directed To
                                    </h2>
                                    <div className="flex gap-[10px] items-center">
                                      <BsFillPersonFill />
                                      <p>{item.fixer}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-[10px] justify-between">
                                    {item.resolved == "no" ? (
                                      <div className="flex gap-[5px] items-center text-red-600">
                                        <FaRegSadCry />
                                        <p>Not Resolved</p>
                                      </div>
                                    ) : (
                                      <div className="flex gap-[5px] items-center ">
                                        <MdVerifiedUser className="text-green-700" />

                                        <p className="text-green-700">
                                          Resolved after{" "}
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
                                    <div className="flex items-center gap-[10px]">
                                      <AiOutlineComment className="text-2xl text-teal-700" />
                                      <p>{item.comments.length}</p>
                                    </div>
                                    <div className="flex items-center gap-[10px]">
                                      <AiOutlineArrowUp
                                        className="text-2xl text-teal-700"
                                        title="upvote"
                                      />
                                      <p>{item.likes.length}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>

                          <div className="flex justify-between items-center text-zinc-700 mt-[20px] ">
                            <div className="flex gap-[20px] items-center">
                              <p className=" text-sm text-teal-700">
                                {moment(item.createdAt).fromNow()}
                              </p>
                            </div>
                            {/* <AiOutlineSave
                              className="text-teal-800 text-2xl"
                              onClick={() => handleSave(item)}
                              title="save for later"
                            /> */}
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
                        <p>😥Nothing to show</p>
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
                            className=" mb-[20px] bg-zinc-100  p-2 rounded-lg"
                          >
                            <div onClick={() => handleAddViews(item._id)}>
                              <Link to={`/issue/${item._id}`}>
                                <div className="flex gap-[15px] items-center mb-[10px]">
                                  <p
                                    className={`w-10 h-10 flex items-center justify-center rounded-full ${backgroundClass} text-white`}
                                  >
                                    {item.creator.substring(0, 2)}
                                  </p>
                                  <p className="text-zinc-900 font-bold text-md">
                                    {item.title.substring(0, 22)} ...
                                  </p>
                                </div>

                                <div className="flex gap-[10px] items-center justify-end mb-[10px]">
                                  <CiLocationOn />
                                  <p>{item.location}</p>
                                </div>
                                <div>
                                  <p className="mb-[10px]">
                                    {item.description.substring(0, 100)}...
                                  </p>

                                  <div className=" flex flex-col gap-[10px] mb-[10px]">
                                    <div>
                                      <h2 className="mb-[5px] font-bold text-zinc-600">
                                        Directed To
                                      </h2>
                                      <div className="flex gap-[10px] items-center">
                                        <BsFillPersonFill />
                                        <p>{item.fixer}</p>
                                      </div>
                                    </div>
                                    {/* {console.log(item)} */}
                                    <div className="flex items-center gap-[20px] flex-wrap justify-between">
                                      <div>
                                        {item.resolved == "no" ? (
                                          <>
                                            <div className="flex gap-[5px] items-center text-red-600">
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
                                          <AiOutlineEye className="text-2xl text-teal-700" />
                                          <p>{item.views.length}</p>
                                        </div>
                                        <div className="flex items-center gap-[10px]">
                                          <AiOutlineComment className="text-2xl text-teal-700" />
                                          <p>{item.comments.length}</p>
                                        </div>
                                        <div className="flex items-center gap-[10px]">
                                          <AiOutlineArrowUp
                                            className="text-2xl text-teal-700"
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

                            <div className="flex justify-between items-center text-zinc-700 mt-[20px] ">
                              <div className="flex gap-[20px] items-center">
                                <p className=" text-sm text-teal-700">
                                  {moment(item.createdAt).fromNow()}
                                </p>
                              </div>
                              {/* <AiOutlineSave
                                className="text-teal-800 text-2xl"
                                onClick={() => handleSave(item)}
                                title="save for later"
                              /> */}
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
          {/*  */}
        </div>
      </div>
      {/*  */}
    </div>
  );
};

export default Resolved;
