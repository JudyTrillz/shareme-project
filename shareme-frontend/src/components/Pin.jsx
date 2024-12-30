import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Used for generating unique id for items

import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { urlFor, client } from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const navigate = useNavigate();
  const [postHover, setPostHover] = useState(false);
  const [savePost, setSavePost] = useState(false);
  const [unSavePost, setUnSavePost] = useState(false);

  const user = fetchUser();

  const alreadySaved = save?.some((item) => item.postedBy?._id === user?.id);

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavePost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.id,
            postedBy: {
              _type: "postedBy",
              _ref: user?.id,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavePost(false);
        })
        .catch((error) => {
          console.error("Error saving pin:", error);
          setSavePost(false);
        });
    }
  };

  const unSavePin = (id) => {
    const savedEntry = save?.find((item) => item.postedBy?._id === user?.id);
    const savedKey = savedEntry ? savedEntry._key : null;

    if (savedEntry) {
      setUnSavePost(true);

      client
        .patch(id)
        .unset([`save[_key=="${savedKey}"]`])
        .commit()
        .then(() => {
          window.location.reload();
          setUnSavePost(false);
        })
        .catch((error) => {
          console.error("Error unsaving pin:", error);
          setUnSavePost(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onMouseEnter={() => {
          setPostHover(true);
        }}
        onMouseLeave={() => {
          setPostHover(false);
        }}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="rounded-lg w-full"
        />

        {user && postHover && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-10"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full z-70 flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 duration-500 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 duration-700 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    unSavePin(_id);
                  }}
                >
                  {save?.length > 0 ? save?.length : ""} Saved
                </button>
              ) : (
                <button
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  {save?.length > 0 ? save?.length : ""} Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(8, 15)}...`
                    : destination.slice(8)}
                </a>
              )}

              {postedBy?._id === user?.id && (
                <button
                  className="bg-white opacity-70 hover:opacity-100 text-black font-bold p-2 text-base rounded-3xl hover:shadow-md outline-none"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          src={postedBy?.image}
          alt="user image"
          loading="lazy"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
