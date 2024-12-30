import React from "react";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SignIn = ({ message }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="flex items-center gap-3 bg-red-400 text-white p-2 mt-8 mx-auto rounded-lg"
      onClick={() => {
        navigate("/login");
      }}
    >
      <FaSignInAlt
        fontSize={20}
        color="black"
      />
      <p className="capitalize font-semibold text-lg">{message}</p>
    </button>
  );
};

export default SignIn;
