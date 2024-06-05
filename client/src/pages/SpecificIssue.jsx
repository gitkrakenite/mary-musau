import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Comment from "../components/Comment";
import axios from "../axios";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
  AiOutlineComment,
  AiOutlineShop,
} from "react-icons/ai";
import moment from "moment";
import { FaRegSadCry } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { BsFillPersonFill, BsPen, BsTrash } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";

const SpecificIssue = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // fetch the issue
  const { id } = useParams();
  const [singleIssue, setSingleIssue] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIssue = async () => {
    try {
      setLoading(true);

      let checkParam = id;
      const response = await axios.get("/report/specific/" + checkParam);
      if (response) {
        setLoading(false);
        setSingleIssue([response.data]);
        console.log(response.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error Fetching Issue.");
      toast.error("Network error or doesn't exist");
    }
  };

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

  useEffect(() => {
    fetchIssue();
  }, []);

  // upvote issue
  const handleUpVote = async (issue) => {
    try {
      if (!user) {
        toast.error("Please Login To upvote", { theme: "dark" });
        return;
      }

      let email = user.email;
      let id = issue._id;
      let upvoteData = { email };

      let response = await axios.post("/report/like/" + id, upvoteData);
      if (response) {
        if (user.email !== issue.creator) {
          // create notification
          let sender = user.email;
          let receiver = issue.creator;
          let message = `your report ${issue.title} has a new upvote from ${user.email}`;
          let referID = id;
          let notifyData = { sender, receiver, message, referID };

          await axios.post("/notify/create", notifyData);
        }
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed To Upvote");
    }
  };

  // update resolved
  const [resolved, setResolved] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!resolved) return toast.error("You must choose");

    try {
      const dataToSend = { resolved };
      const response = await axios.put("/report/edit/" + id, dataToSend);
      if (response) {
        toast.success("Updated successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Action Failed. Check network");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return toast.error("ID invalid. Contact admin");

    let isDelete = window.confirm("Delete This Issue ? ");

    if (isDelete) {
      try {
        let response = await axios.delete("/report/delete/" + id);
        if (response) {
          toast.success("deleted");
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed. Check Network or Contact admin");
      }
    }
  };

  return (
    <div>
      {/* wrapper */}
      <div>
        {/* topbar */}
        <div className="w-full mb-2 sm:mb-[4em]">
          <Link to="/">
            <div className=" px-2 sm:px-8 py-[1em] flex items-center gap-[10px]">
              <AiOutlineArrowLeft className="text-xl" />
              <p>Back Home</p>
            </div>
          </Link>
        </div>
        {/* product */}

        {loading ? (
          <div className="w-full justify-center flex mt-[8em]">
            <Spinner message="Fetching Issue" />
          </div>
        ) : (
          <div>
            <div className=" px-[10px] md:px-[3em] xl:px-[5em]">
              {singleIssue?.map((item) => (
                <>
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row  gap-[2em] mb-[2em]"
                  >
                    {/* img side */}
                    <div className=" flex-[0.5] flex w-full justify-center">
                      <div>
                        <div>
                          <img
                            src={item.photo}
                            alt=""
                            className=" w-full h-full object-cover rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    {/* text side */}
                    <div className="flex-[0.5]">
                      {/* options */}
                      <div className="flex justify-between mb-[1em]">
                        <div>
                          <p># {item.category}</p>
                        </div>

                        {user && (
                          <div className="flex items-center gap-[3em]">
                            <div className="flex items-center gap-2">
                              <AiOutlineArrowUp
                                className="text-2xl text-pink-700 cursor-pointer z-10"
                                title="Upvote This Product"
                                onClick={() => handleUpVote(item)}
                              />
                              <p>{item.likes.length}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <AiOutlineComment className="text-2xl text-pink-700 " />
                              <p>{item.comments.length}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* options */}
                      <div className="flex flex-col gap-[12px] mt-[25px]">
                        {user && (
                          <div className="flex justify-between items-center">
                            <button
                              className="bg-pink-800 text-white text-3xl p-2 rounded-md cursor-pointer"
                              onClick={() => handleSave(item)}
                            >
                              <AiOutlineShop />
                            </button>
                            {item.creator === user.email && (
                              <div className="flex gap-[20px] items-center">
                                <Link to={`/edit-issue/${item._id}`}>
                                  <BsPen className="text-teal-800 text-2xl" />
                                </Link>
                                <BsTrash
                                  className="text-red-500 text-2xl cursor-pointer"
                                  onClick={() => handleDelete(item._id)}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        {/* if you are the logged in user */}

                        {item.creator === user.email && (
                          <div>
                            <form onSubmit={handleUpdate}>
                              <div className="flex flex-col gap-[10px]">
                                <label
                                  htmlFor="update"
                                  className="text-xl font-bold text-zinc-700"
                                >
                                  Update Status ?
                                </label>
                                <select
                                  name="update"
                                  id="update"
                                  className="bg-zinc-800 text-zinc-200 border border-zinc-400 p-2 rounded-lg"
                                  value={resolved}
                                  onChange={(e) => setResolved(e.target.value)}
                                >
                                  <option value="">Choose</option>
                                  <option value="yes">Resolved</option>
                                  <option value="no">Not Resolved</option>
                                </select>
                              </div>
                              <div className="flex justify-center w-full">
                                <button
                                  className="mt-[15px] p-2 rounded-lg bg-pink-800 text-white "
                                  onClick={handleUpdate}
                                >
                                  Update Now
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                        {/*  */}
                      </div>

                      {/*  */}
                      <div>
                        <div className=" mt-[1.3em] mb-[1em]">
                          <p className="text-2xl font-bold mb-2">
                            {item.title}
                          </p>

                          <div className="flex justify-between items-center mt-[1em] gap-[16px] flex-wrap">
                            <div className="flex gap-[10px] items-center justify-end mb-[10px]">
                              <CiLocationOn />
                              <p>{item.location}</p>
                            </div>
                            <div>
                              {!item.resolved ? (
                                <div className="flex gap-[5px] items-center text-pink-600">
                                  <FaRegSadCry />
                                  <p>Not Resolved</p>
                                </div>
                              ) : (
                                <div className="flex gap-[5px] items-center">
                                  <MdVerifiedUser />
                                  <p>Resolved</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="mb-[1em]">{item.description}</p>
                        <p className=" text-sm text-pink-400 text-end">
                          {moment(item.createdAt).fromNow()}
                        </p>
                      </div>
                      {/* comments` */}
                      <div className="mt-[1em]">
                        <Comment item={item} />
                      </div>
                    </div>
                  </div>
                  {/*  */}
                </>
              ))}
            </div>
          </div>
        )}
        {/*  */}
      </div>
    </div>
  );
};

export default SpecificIssue;
