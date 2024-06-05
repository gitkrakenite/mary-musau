import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import moment from "moment";
import Spinner from "../components/Spinner";

const Notifications = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [MyNotif, setMyNotif] = useState([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const handleFetchNotification = async () => {
    if (!user?.campusID) {
      navigate("/login");
      return toast.error("Please Login");
    }

    try {
      setLoadingNotif(true);
      let campusID = user.campusID;
      let dataToSend = { campusID };
      const res = await axios.post("/notify/mine", dataToSend);

      if (res && res.data) {
        const notifications = Array.isArray(res.data) ? res.data : [res.data];
        setMyNotif(notifications);
        setLoadingNotif(false);
      } else {
        setMyNotif([]); // Set an empty array if no data is received
        setLoadingNotif(false);
        console.error("Invalid data format received:", res.data);
      }
    } catch (error) {
      toast.error("Error Fetching Notifications");
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    handleFetchNotification();
  }, [user]);

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete("/notify/delete/" + id);
      handleFetchNotification();
    } catch (error) {
      toast.error("Something went tomorrow");
    }
  };

  return (
    <div>
      {/* wrapper */}
      <div className="pt-[1em] px-[3em]">
        {/* topbar */}
        <div>
          <Link to="/home">
            <AiOutlineArrowLeft className="text-3xl " />
          </Link>
        </div>

        {/* all Notifications */}

        <div>
          {loadingNotif ? (
            <div className="h-[70vh] w-full flex justify-center items-center">
              <Spinner message="Fetching Notifications" />
            </div>
          ) : (
            <>
              {MyNotif.length < 1 ? (
                <div className="w-[full] h-[70vh] flex justify-center items-center">
                  <p>👋Hello. You are all caught up</p>
                </div>
              ) : (
                <div className="mt-[3em]">
                  {MyNotif.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleDeleteNotification(item._id)}
                    >
                      <div className="mb-[20px] bg-zinc-300 p-2 rounded-lg">
                        <Link to={`/issue/${item.referID}`}>
                          <p className="text-sm text-zinc-500">
                            New Comment From {item.sender}
                          </p>
                          <p className="my-[10px]">{item.message}</p>
                          <p className="text-sm text-teal-700">
                            {moment(item.createdAt).fromNow()}
                          </p>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/*  */}
    </div>
  );
};

export default Notifications;
