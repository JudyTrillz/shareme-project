import { useGoogleLogin } from "@react-oauth/google"; //* For custom button
import { FcGoogle } from "react-icons/fc"; //* For custom button
import { FaUser } from "react-icons/fa";

// import { jwtDecode } from "jwt-decode"; //! For google default button
// import { GoogleLogin } from "@react-oauth/google"; //! For google default button

// * OTHER IMPORTS
import { useNavigate } from "react-router-dom";
import logo from "../assets/logowhite.png";
import share from "../assets/share.mp4";

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  // * FOR CUSTOM GOOGLE LOGIN BUTTON
  const signIn = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // fetch the logged in user data =====>>
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        if (res.ok) {
          // Convert user data to json and save to localStorage =====>>
          const userInfo = await res.json();
          localStorage.setItem("user", JSON.stringify(userInfo));
          const { name, id, picture } = userInfo;

          // Create a new sanity document for the signed in user and save it to the database=====>>
          const doc = {
            _id: id,
            _type: "user",
            userName: name,
            image: picture,
          };

          client.createIfNotExists(doc).then(() => {
            navigate("/", { replace: true });
          });
        } else {
          throw new Error("Failed to fetch user information");
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={share}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img
              src={logo}
              alt="logo"
              width="130px"
            />
          </div>

          <div className="shadow-2xl">
            <button
              type="button"
              className="bg-mainColor flex gap-2 justify-center items-center p-2 rounded-lg outline-none"
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/");
              }}
            >
              <FaUser />
              <span className="font-bold opacity-55 hover:opacity-100 transition duration-500 ease-in-out">
                View as Demo User
              </span>
            </button>
          </div>

          <div className="shadow-2xl mt-2 ">
            {/* CUSTOM GOOGLE LOGIN BUTTON */}
            <button
              type="button"
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg outline-none"
              onClick={signIn}
            >
              <FcGoogle className="mr-4" />{" "}
              <span className="font-bold">Sign In with Google</span>
            </button>

            {/* GOOGLE LOGIN BUTTON */}
            {/* <GoogleLogin
              onSuccess={(credentialResponse) => {
                const response = jwtDecode(credentialResponse.credential);
                console.log(response);
                navigate("/");
              }}
              onError={(error) => {
                console.log(error);
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
