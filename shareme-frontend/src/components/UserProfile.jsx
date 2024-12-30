import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/Data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { fetchImageFromUnsplash } from "../utils/fetchImage";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("created");
  const [activeBtn, SetActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setImageUrl(await fetchImageFromUnsplash());
      console.log(imageUrl);
    };
    fetchData();
  }, []);

  const changePin = async () => {
    try {
      if (text === "created") {
        const userCreatedQuery = userCreatedPinsQuery(userId);

        await client.fetch(userCreatedQuery).then((data) => {
          setPins(data);
        });
      } else {
        const userSavedQuery = userSavedPinsQuery(userId);

        await client.fetch(userSavedQuery).then((data) => {
          setPins(data);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    changePin();
  }, [text, userId]);

  if (!user) {
    return <Spinner message={"Loading Profile..."} />;
  }

  const logOut = () => {
    googleLogout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={imageUrl}
              className="w-full h-370 xl:h-510 shadow-lg object-cover"
              alt="Banner pic"
            />

            <img
              src={user.image}
              alt="user pic"
              className="rounded-full  w-20 h-20 -mt-10 shadow-xl object-cover"
            />

            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>

            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <button
                  type="button"
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                  onClick={logOut}>
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              )}
            </div>
          </div>

          <div className="text-center mb-7 mt-5">
            <button
              type="button"
              onClick={(e) => {
                SetActiveBtn("created");
                setText(e.target.textContent);
              }}
              className={`capitalize ${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}>
              created
            </button>

            <button
              type="button"
              onClick={(e) => {
                SetActiveBtn("saved");
                setText(e.target.textContent);
              }}
              className={`capitalize ${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}>
              saved
            </button>
          </div>

          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
