import { useState } from "react";
import { useGetPoints } from "./useGetPoints";


export const useSearchRoom = () => {
  const [searchName, setSearchName] = useState("");

  const {namedPoints: dots} = useGetPoints()

  const allDots = dots?.names.flat();
  const filteredDots = allDots?.filter((dot) =>
    dot.name.toLowerCase().includes(searchName.toLowerCase())
  )|| [];

  return { searchName, setSearchName, filteredDots };
};
