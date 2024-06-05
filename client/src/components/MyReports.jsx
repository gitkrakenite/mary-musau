import React, { useEffect, useState } from "react";
import axios from "../axios";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  AiFillStar,
  AiOutlineArrowUp,
  AiOutlineComment,
  AiOutlineDislike,
  AiOutlineLike,
  AiOutlinePhone,
  AiOutlineStar,
} from "react-icons/ai";
import { BsPen, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";

const MyReports = () => {
  // fetch all my issues

  const [allMyIssues, setAllMyIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleFetchMyIssues = async () => {
    try {
      setLoading(true);
      let email = user.email;
      let dataToSend = { email };
      const response = await axios.post("/report/mine", dataToSend);
      if (response) {
        setLoading(false);
        setAllMyIssues(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error Fetching Issues");
    }
  };

  useEffect(() => {
    handleFetchMyIssues();
  }, []);

  // delete my issues
  const handleDelete = async (id) => {
    if (!id) return toast.error("ID invalid. Contact admin");

    let isDelete = window.confirm("Delete This Issue ? ");

    if (isDelete) {
      try {
        let response = await axios.delete("/report/" + id);
        if (response) {
          toast.success("deleted");
        }
      } catch (error) {
        toast.error("Failed. Check Network or Contact admin");
      }
    }
  };

  return (
    <div>
      {/*  */}

      {loading ? (
        <>
          <Spinner message="Fetching Your Issues .." />
        </>
      ) : (
        <>
          {allMyIssues.length < 1 ? (
            <>
              <div className="h-[20vh] w-full flex justify-center items-center">
                <div>
                  <h2 className="text-center mb-2">Hello 👋.</h2>
                  <h2>You have not reported any issues yet.</h2>
                  <Link to="/new-issue">
                    <h2 className="mt-[10px] mb-[10px] text-center text-emerald-600 underline">
                      Add one Here
                    </h2>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-xl mb-[10px] text-zinc-600 font-bold">
                  Issues You Reported
                </h2>
              </div>

              {/*  */}
              <div className="flex gap-[10px] overflow-x-scroll w-full prompt pb-2">
                <div className="flex flex-nowrap">
                  <div
                    key={allMyIssues._id}
                    className="flex-shrink-0 mr-[15px]"
                  >
                    <Link to={`/issue/${allMyIssues._id}`}>
                      <div className="relative rounded-lg group ">
                        <div className="overlay absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-100">
                          <div
                            className="bg-gradient-to-t
                                  from-transparent to-black opacity-80 w-full h-full rounded-md"
                          >
                            {/* top stats */}
                            <div>
                              <div className="absolute top-[20px] flex gap-[10%]  w-full justify-between px-2 ">
                                <div>
                                  <p className="text-white">
                                    #{allMyIssues.category}
                                  </p>
                                </div>
                                <div className="flex gap-[20px]">
                                  <p className="text-white text-md flex items-center gap-[5px]">
                                    <AiOutlineLike className="text-lg" />
                                    <span>{allMyIssues.likes.length}</span>
                                  </p>
                                  <p className="text-white text-md flex items-center gap-[5px]">
                                    <AiOutlineComment className="text-lg" />
                                    <span>{allMyIssues.comments.length}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="absolute top-[80px] left-3">
                                <p className="text-white">
                                  {allMyIssues.title}
                                </p>
                              </div>
                            </div>
                            {/*  */}
                            <div className="absolute bottom-[20px] left-[20px]  flex gap-[10%] w-full ">
                              <div>
                                <div className="flex gap-[10px] text-zinc-300">
                                  {/* <p>{item.location}</p> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <img
                          src={allMyIssues.photo}
                          alt=""
                          className="w-72 h-80 rounded-md object-cover"
                        />
                      </div>
                    </Link>
                    {/* options */}
                    <div className="flex justify-between items-center mt-[10px]">
                      <Link to={`/edit-issue/${allMyIssues._id}`}>
                        <BsPen
                          className="text-xl text-emerald-600 cursor-pointer"
                          title="update"
                        />
                      </Link>
                      <BsTrash
                        className="text-xl text-red-600 cursor-pointer"
                        onClick={() => handleDelete(allMyIssues._id)}
                        title="delete"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/*  */}
            </>
          )}
        </>
      )}

      {/*  */}
    </div>
  );
};

export default MyReports;
