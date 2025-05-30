import { useState } from "react";
import dots from "../assets/names.json";

export const useSearchRoom = () => {
  const [searchName, setSearchName] = useState("");

  const allDots = dots.names.flat();
  const filteredDots = allDots.filter((dot) =>
    dot.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return { searchName, setSearchName, filteredDots };
};
