import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../axios";
import moment from "moment";
import Spinner from "./Spinner";
import { AiOutlineDelete } from "react-icons/ai";

const Comment = ({ item }) => {
  const { user } = useSelector((state) => state.auth);

  // comment
  const [comment, setComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  const handleComment = async (issue) => {
    try {
      if (!comment) {
        toast.error("Comment cannot be empty", { theme: "dark" });
        return;
      }

      setLoadingComment(true);

      let email = user.email;
      let id = issue._id;
      let commentData = { email, comment };

      // comment
      await axios.post("/report/comment/" + id, commentData);

      if (user.email !== issue.creator) {
        // create notification
        let sender = user.email;
        let receiver = item.creator;
        let message = `your issue ${issue.title} has a new comment`;
        let referID = id;
        let notifyData = { sender, receiver, message, referID };

        await axios.post("/notify/create", notifyData);
      }

      setLoadingComment(false);
      setComment("");

      window.location.reload();
    } catch (error) {
      setLoadingComment(false);
      toast.error("Failed To Add Comment");
    }
  };

  const handleDeleteComment = async (commentID) => {
    // /comment/:id/:commentId
    if (!commentID) return;

    try {
      let id = item._id;
      // console.log(commentID, id);
      const response = await axios.delete(`/report/comment/${id}/${commentID}`);
      if (response) {
        toast.success("deleted");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed");
    }
  };

  return (
    <div className="w-full ">
      {/*  */}
      <>
        {!user ? (
          <>
            <p className="font-bold">You Must Sign In To Comment</p>
          </>
        ) : (
          <>
            <form onSubmit={() => handleComment(item)}>
              <div>
                <label htmlFor="comment" className="flex items-center gap-8">
                  <p>Comment Now ?</p>
                </label>
              </div>
              <div className="flex items-center pt-[20px] w-[100%]  gap-[10px] ">
                <textarea
                  name="comment"
                  id="comment"
                  cols="30"
                  rows="2"
                  placeholder="Enter Comment"
                  className="w-[100%] bg-transparent p-[8px] outline-none border-none rounded-md"
                  style={{ border: "1px solid #5e5d5d" }}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <p
                  className="cursor-pointer"
                  onClick={() => handleComment(item)}
                >
                  {loadingComment ? (
                    <p className="bg-orange-800 text-zinc-200 p-[8px] rounded-lg">
                      wait...
                    </p>
                  ) : (
                    <p className="bg-pink-700 p-[8px] text-white rounded-lg">
                      comment
                    </p>
                  )}
                </p>
              </div>
            </form>
          </>
        )}
      </>
      {/*  */}
      {/* show all comments */}
      <div className="mt-[30px] p-[5px] rounded-lg">
        {/* {console.log(item.comments)} */}

        {/* fetch comments from latest to earliest */}
        {item.comments.length >= 1 ? (
          <>
            {[...item.comments].reverse().map((item, index) => (
              <div
                key={item._id}
                className="mb-[15px]  p-2 rounded-xl"
                style={{}}
              >
                <div className="flex mb-[10px] items-center justify-between">
                  <div className="flex items-center gap-[20px]">
                    <p
                      className={`w-7 h-7 flex items-center text-sm justify-center rounded-full bg-teal-800 text-white`}
                    >
                      {item.email.substring(0, 2)}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      {moment(item.createdAt).fromNow()}
                    </p>
                  </div>

                  {user?.email == item.email && (
                    <p>
                      <AiOutlineDelete
                        className="text-2xl text-red-500 cursor-pointer"
                        onClick={() => handleDeleteComment(item._id)}
                      />
                    </p>
                  )}
                </div>

                <div className=" my-2">
                  {/* <p style={{ wordWrap: "break-word" }}>{item.comment}</p> */}
                  <p style={{ wordWrap: "break-word" }}>{item.comment}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="p-[10px] text-gray-400">
            <p>
              No Comments for{" "}
              <span className="text-gray-600">{item?.title}</span> Yet
            </p>
          </div>
        )}
      </div>
      {/*  */}
    </div>
  );
};

export default Comment;
