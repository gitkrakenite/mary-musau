import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DummyCategory, DummyRoles } from "../DummyData";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import axios from "../axios";
import imageCompression from "browser-image-compression";

const Create = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [fixer, setFixer] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return toast.error("title missing");
    if (!description) return toast.error("description missing");
    if (!category) return toast.error("category missing");
    if (!photo) return toast.error("photo missing");
    if (!location) return toast.error("location missing");

    if (title.length < 3 || title.length > 50) {
      toast.warning("title between 3 - 50 letters", { theme: "dark" });
      return;
    }
    if (description.length < 10) {
      toast.warning("description must exceed 10 letters", { theme: "dark" });
      return;
    }

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

      const response = await axios.post("/report/create", dataToSend);
      if (response) {
        setLoading(false);
        toast.success("Added " + title);
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error adding issue");
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
              <h2 className="font-bold text-md text-zinc-500">
                Report Something
              </h2>
            </div>
          </div>
        </div>
        {/* form */}
        <div className="mt-[2em] pb-[1.3em] w-full">
          <form
            className=" w-[98%] sm:w-[80%] md:w-[65%] lg:w-[50%] m-auto"
            onSubmit={handleCreate}
          >
            <div className="flex flex-col gap-[8px] mb-[12px]">
              <label htmlFor="title" className="" style={{ fontWeight: 600 }}>
                Short Catchy Title
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
              <label htmlFor="desc" className="" style={{ fontWeight: 600 }}>
                Briefly Describe the issue
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
                  <p>Attach A Photo</p>
                  <div>
                    {loadingPhoto ? (
                      <Spinner />
                    ) : (
                      <div className="flex flex-col items-center">
                        <img
                          src={
                            photo
                              ? photo
                              : "https://images.pexels.com/photos/8834489/pexels-photo-8834489.jpeg?auto=compress&cs=tinysrgb&w=400"
                          }
                          alt=""
                          className="w-[100px] h-[100px] object-cover"
                        />
                      </div>
                    )}
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
                Select Category
              </label>

              <select
                name="category"
                id="category"
                className="p-[8px] bg-transparent border border-zinc-400 rounded-lg bg-zinc-600 text-white"
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
                <p>Specify Location Within</p>
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
                onClick={handleCreate}
              >
                Voice Out Issue
              </button>
            )}
          </form>
        </div>
        {/*  */}
      </div>
    </div>
  );
};

export default Create;
