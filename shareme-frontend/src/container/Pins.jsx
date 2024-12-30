import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { NavBar, Feed, PinDetails, CreateAPin, Search } from "../components";

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <NavBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>

      <div className="h-full">
        <Routes>
          <Route
            path="/"
            element={<Feed user={user} />}
          />

          <Route
            path="/category/:categoryId"
            element={<Feed user={user} />}
          />

          <Route
            path="/pin-detail/:pinId"
            element={<PinDetails user={user} />}
          />

          <Route
            path="/create-pin"
            element={<CreateAPin user={user} />}
          />

          <Route
            path="/search"
            element={
              <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
