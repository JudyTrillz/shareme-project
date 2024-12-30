import { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/Data";

const CreateAPin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [imageAsset, setImageAsset] = useState(null);
  const [category, setCategory] = useState(null);

  const [wrongImageType, setWrongImageType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);

  const navigate = useNavigate();

  // Select Image functionality =====>>
  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/jpeg" ||
      type === "image/png" ||
      type === "image/gif" ||
      type === "image/tiff" ||
      type === "image/svg+xml"
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error uploading the image", error);
        });
    } else {
      setWrongImageType(true);

      setTimeout(() => {
        setWrongImageType(false);
      }, 3000);
    }
  };

  // Save Pin functionality =====>>
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination: `https://${destination}`,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill in all the fields!
        </p>
      )}
      {/* This div is for the the image selection. */}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-ful">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420 text-center">
            {loading && <Spinner />}
            {wrongImageType && (
              <p className="text-red-500">Wrong image format.</p>
            )}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full cursor-pointer">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="md:mt-10 mt-20 text-gray-400">
                    Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>

                <input
                  type="file"
                  name="upload-image"
                  id="uploadImage"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        {/*  This div is for the form input fields. */}
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
          />

          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-image"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}

          <input
            type="text"
            className="outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about"
          />

          <input
            type="text"
            className="outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
          />

          <div className="flex flex-col">
            <div className="">
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose Pin Category
              </p>

              <select
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option
                  value="other"
                  className="bg-white"
                >
                  Select Category
                </option>

                {categories.map((category, i) => (
                  <option
                    key={i}
                    value={category.name}
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-start items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAPin;
