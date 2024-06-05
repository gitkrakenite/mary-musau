import React from "react";
import axios from "../axios";
import Spinner from "../components/Spinner";

const Admin = () => {
  return (
    <div className=" w-[100%] sm:w-[90%] m-auto py-[3px] md:py-[1em] ">
      {/* wrapper */}
      <div>
        {/* toppart */}
        <div>
          <div className="boxedContainer">
            <img
              src="https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt=""
            />
            <p>You have</p>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/268976/pexels-photo-268976.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
