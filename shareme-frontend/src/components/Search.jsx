import React, { useState, useEffect } from "react";

import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/Data";
import Spinner from "./Spinner";

const Search = ({ searchTerm, setSearchTerm }) => {
  const [pins, SetPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);

      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query).then((data) => {
        SetPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        SetPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message={"Searching for Pins ..."} />}

      {pins?.length !== 0 && <MasonryLayout pins={pins} />}

      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No Pins Found</div>
      )}
    </div>
  );
};

export default Search;
