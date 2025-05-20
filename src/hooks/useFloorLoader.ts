import { useGLTF } from "@react-three/drei";
import { useState } from "react";

const MOCK_PATHS = ["/dstu_0.glb", "/dstu.glb",];

export const useFloorLoader = () => {
  const [floorNumber, setFloorNumber] = useState(1);

  const modelFloors = useGLTF(MOCK_PATHS);

  const handleChangeFloor = (i: number) => setFloorNumber(i);

  const arrFloors = MOCK_PATHS.map((_, i) => i);

  const selectedFloor = modelFloors[floorNumber];

  return { floorNumber, handleChangeFloor, arrFloors, modelFloors, selectedFloor };
};
