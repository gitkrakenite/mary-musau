import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { AiOutlineArrowLeft } from "react-icons/ai";
import MyReports from "../components/MyReports";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      {/* wrapper */}
      <div className="px-[10px]  sm:px-[3em] pt-[1em]">
        {/* topbar */}
        <div className="flex justify-between items-center">
          <Link to="/home">
            <AiOutlineArrowLeft />
          </Link>
          <p onClick={handleLogout} className="cursor-pointer font-semibold">
            LOGOUT
          </p>
        </div>
        {/* user details */}
        <div className="mt-[3em] mb-[2em] w-full ">
          <div>
            <div className="h-[70vh] w-full  flex justify-center items-center">
              <div>
                <div className="mb-[20px] w-full flex justify-center items-center">
                  <img
                    src={user.profile}
                    alt=""
                    className="w-[120px] h-[120px] object-cover rounded-full"
                  />
                </div>
                <div className=" text-center flex flex-col gap-4">
                  <p>Your Full Name : {user?.fullName} </p>
                  <p>Your email : {user?.email}</p>
                  <p>Your phone : {user?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/* Issues Stuff */}
        <div className="mt-[3em] pb-[2em]">{user?.email && <MyReports />}</div>
      </div>
    </div>
  );
};

export default Account;
