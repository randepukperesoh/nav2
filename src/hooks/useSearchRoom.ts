import { useState } from "react";
import dots from "../assets/names.json";

export const useSearchRoom = () => {
  const [searchName, setSearchName] = useState("");

  const filteredDots = dots.names.filter((dot) =>
    dot.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return { searchName, setSearchName, filteredDots };
};
