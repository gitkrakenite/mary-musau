import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { DummyBizCategory } from "../../Dummydata";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import axios from "../axios";
import { DummyCategory, DummyRoles } from "../DummyData";
import imageCompression from "browser-image-compression";

const EditIssue = () => {
  const { user } = useSelector((state) => state.auth);
  // fetch the Issue
  const { id } = useParams();
  const [myIssue, setMyIssue] = useState([]);
  const navigate = useNavigate();

  const fetchIssue = async () => {
    try {
      setLoading(true);

      let checkParam = id;
      const response = await axios.get("/report/specific/" + checkParam);
      if (response) {
        setLoading(false);
        setMyIssue([response.data]);
        // console.log(response.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error Fetching Issue.");
      toast.error("Network error or doesn't exist");
    }
  };

  useEffect(() => {
    fetchIssue();
  }, []);

  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const postPhoto = async (pic) => {
    if (pic === null || undefined) {
      toast.error("Please select photo", { theme: "dark" });
      return;
    }

    // Compress the image
    const options = {
      maxSizeMB: 1, // Adjust the maximum size of the compressed image
      maxWidthOrHeight: 1920, // Adjust the maximum width or height of the compressed image
      useWebWorker: true, // Use Web Worker for better performance
    };

    try {
      setLoadingPhoto(true);
      const compressedFile = await imageCompression(pic, options);
      const data = new FormData();
      data.append("file", compressedFile);
      data.append("upload_preset", "p2jnu3t2");
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/ddqs3ukux/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const urlData = await res.json();
      setLoadingPhoto(false);
      setPhoto(urlData.url);
      toast.success("Uploaded Photo", { theme: "dark" });
    } catch (error) {
      setLoadingPhoto(false);
      toast.error("Error uploading Photo", { theme: "dark" });
    }
  };
  //update data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [fixer, setFixer] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const [updatetitle, setupdateTitle] = useState("");
  const [updatedescription, setupdateDescription] = useState("");
  const [updatecategory, setupdateCategory] = useState("");
  const [updatePhoto, setupdatePhoto] = useState("");
  const [updateFixer, setupdateFixer] = useState("");
  const [updateLocation, setupdateLocation] = useState("");

  useEffect(() => {
    setTitle(updatetitle);
    setDescription(updatedescription);
    setCategory(updatecategory);
    setPhoto(updatePhoto);
    setLocation(updateLocation);
  }, [updatetitle, updatecategory, updateLocation]);

  const [showForm, setShowForm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title) return toast.error("title missing");
    if (!category) return toast.error("category missing");
    if (!description) return toast.error("description missing");
    if (!photo) return toast.error("photo missing");
    if (!location) return toast.error("location missing");

    try {
      setLoading(true);
      let creator = user?.email;
      let dataToSend = {
        title,
        description,
        category,
        photo,
        creator,
        location,
      };
      const response = await axios.put("/report/edit/" + id, dataToSend);
      if (response) {
        setLoading(false);
        toast.success("Updated " + title);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error updating Issue");
    }
  };

  return (
    <div>
      {/* wrapper */}
      <div className="px-[10px] pt-[10px]">
        {/* topbar */}
        <div>
          <div className="flex gap-4 items-center">
            <Link to="/">
              <AiOutlineArrowLeft className="text-lg" />
            </Link>
            <div>
              <h2 className="font-bold text-md text-zinc-600">Update Issue</h2>
            </div>
          </div>
        </div>

        {myIssue?.map((item) => (
          <div key={item._id}>
            {showForm ? (
              <>
                <form
                  className=" w-[98%] sm:w-[80%] md:w-[65%] lg:w-[50%] m-auto"
                  onSubmit={handleUpdate}
                >
                  <div className="flex flex-col gap-[8px] mb-[12px]">
                    <label
                      htmlFor="title"
                      className=""
                      style={{ fontWeight: 600 }}
                    >
                      Update Title
                    </label>
                    <input
                      type="text"
                      placeholder="title here"
                      id="title"
                      value={title}
                      required
                      minLength={2}
                      maxLength={40}
                      onChange={(e) => setTitle(e.target.value)}
                      className="p-[8px] bg-transparent border border-zinc-400 rounded-lg"
                    />
                  </div>
                  {/* description */}
                  <div className="flex flex-col gap-[8px] mb-[12px]">
                    <label
                      htmlFor="desc"
                      className=""
                      style={{ fontWeight: 600 }}
                    >
                      Update Description
                    </label>
                    <textarea
                      name="desc"
                      id="desc"
                      cols="30"
                      rows="3"
                      minLength={5}
                      maxLength={500}
                      required
                      placeholder="what you do max(500)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="p-[8px] bg-transparent border border-zinc-400 rounded-lg"
                    ></textarea>
                  </div>
                  {/* upload image */}
                  <div className="flex flex-col items-start gap-[20px] sm:gap-0 sm:flex-row sm:items-center mt-[20px] mb-[20px]  px-[5px] rounded-lg">
                    <div className="flex flex-col gap-2 mt-[20px]">
                      <label
                        htmlFor="mainPhoto"
                        className="flex items-center gap-[20px] flex-wrap"
                      >
                        <p>Update Photo</p>
                        <div className="flex flex-col items-center">
                          <img
                            src={
                              photo
                                ? photo
                                : "https://pixel-share-25.netlify.app/assets/preview-35b286f0.png"
                            }
                            alt=""
                            className="w-[100px] h-[100px] object-cover"
                          />
                        </div>
                      </label>
                      <input
                        type="file"
                        placeholder="Add Image"
                        accept="image/*"
                        onChange={(e) => postPhoto(e.target.files[0])}
                        required
                        id="mainPhoto"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* category */}
                  <div className="flex flex-col gap-[8px] mb-[12px]">
                    <label
                      htmlFor="categeory"
                      className=""
                      style={{ fontWeight: 600 }}
                    >
                      Update Category
                    </label>

                    <select
                      name="category"
                      id="category"
                      className="p-[8px] bg-transparent border border-zinc-400 rounded-lg bg-zinc-800 text-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Choose</option>
                      {DummyCategory.map((item) => (
                        <option key={item.id} className="">
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* location */}
                  <div className="flex flex-col gap-[8px] mb-[12px]">
                    <label
                      htmlFor="specificAdd"
                      className=""
                      style={{ fontWeight: 600 }}
                    >
                      <p>Update Specific Location</p>
                    </label>
                    <input
                      type="text"
                      placeholder="popular local name"
                      id="specificAdd"
                      value={location}
                      minLength={2}
                      maxLength={50}
                      onChange={(e) => setLocation(e.target.value)}
                      className="p-[8px] bg-transparent border border-zinc-400 rounded-lg"
                    />
                  </div>

                  {/* fixer */}

                  {loading || loadingPhoto ? (
                    <div className="w-full">
                      <p className="text-center">Please wait 😊 ... </p>
                    </div>
                  ) : (
                    <button
                      className="bg-pink-800 text-white w-full p-[8px] rounded-md"
                      onClick={handleUpdate}
                    >
                      Update Issue
                    </button>
                  )}
                </form>
              </>
            ) : (
              <>
                <h2
                  className="font-bold flex w-full h-[70vh] justify-center items-center text-pink-400 underline cursor-pointer text-center"
                  onClick={() => {
                    setShowForm(true);
                    setupdateTitle(item.title);
                    setupdateDescription(item.description);
                    setupdateCategory(item.category);
                    setupdatePhoto(item.photo);
                    setupdateFixer(item.fixer);
                    setupdateLocation(item.location);
                  }}
                >
                  Click Here To Update {item.title}
                </h2>
              </>
            )}
          </div>
        ))}

        {/*  */}
      </div>
    </div>
  );
};

export default EditIssue;
