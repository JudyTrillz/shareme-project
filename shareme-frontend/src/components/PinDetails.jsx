import { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/Data";
import Spinner from "./Spinner";
import SignIn from "./SignIn.jsx";
import { shortenUrl } from "../utils/url.js";

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState("");
  const { pinId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
          window.location.reload();
        });
    }
  };

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetails(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);

          client.fetch(query).then((response) => {
            setPins(response);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetails) return <Spinner message={"Loading Pin ..."} />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        {/* THIS DIV WRAPS THE IMAGE  */}
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetails?.image && urlFor(pinDetails.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user Post"
          />
        </div>

        {/* THIS DIV WRAPS THE ENTIRE ABOUT CONTENT */}
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetails.image.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full z-70 flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 duration-500 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetails.destination}
              target="_blank"
              rel="noreferrer"
            >
              {shortenUrl(pinDetails.destination)}
            </a>
          </div>

          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetails.title}
            </h1>

            <p className="mt-3">{pinDetails.about}</p>
          </div>

          <Link
            // Added the "/" in front of the to attr of the link tag to fix the error of blank page
            to={`/user-profile/${pinDetails.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetails.postedBy?.image}
              alt="user image"
              loading="lazy"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-semibold capitalize">
              {pinDetails.postedBy?.userName}
            </p>
          </Link>

          <h2 className="mt-10 text-2xl">Comments</h2>

          <div className="max-h-370 overflow-y-auto">
            {pinDetails?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}
              >
                <Link to={`/user-profile/${comment?.postedBy?._id}`}>
                  <img
                    src={comment?.postedBy.image}
                    alt="user-profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                </Link>

                <div className="flex flex-col justify-center">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}

            <div>{!user && <SignIn message={"Sign in to add Comments"} />}</div>
          </div>

          {/* CONTAINER FOR CREATING COMMENTs */}
          {user && (
            <div className="flex flex-wrap mt-6 gap-3">
              {/* <Link to={`user-profile/${pinDetails.postedBy?._id}`}> */}
              {/* I CHANGED THIS BECAUSE THE TOP CODE USES THE PERSON WHOP POSTED THE PIN INSTEAD OF THE CURRENT SIGNED IN USER  */}
              <Link to={`/user-profile/${user?._id}`}>
                <img
                  src={user?.image}
                  alt="user image"
                  loading="lazy"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </Link>

              <input
                type="text"
                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                name="comment"
                id="comment"
                placeholder="Add your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? "Posting the comment ..." : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>

      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More Like This ....
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <div className="mt-2">
          <Spinner message={"Loading More Pins"} />
        </div>
      )}
    </>
  );
};

export default PinDetails;
