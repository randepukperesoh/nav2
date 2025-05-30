import { useGLTF } from "@react-three/drei";
import { useState } from "react";

const MOCK_PATHS = ["/dstu_0.glb", "/dstu_1.glb", "/dstu_2.glb", "/dstu_3.glb", "/dstu_4.glb", "/dstu_5.glb", "/dstu_6.glb", "/dstu_7.glb", "/dstu_8.glb"];

export const useFloorLoader = () => {
  const [floorNumber, setFloorNumber] = useState(1);

  const modelFloors = useGLTF(MOCK_PATHS);

  const handleChangeFloor = (i: number) => setFloorNumber(i);

  const arrFloors = MOCK_PATHS.map((_, i) => i);

  const selectedFloor = modelFloors[floorNumber];

  return { floorNumber, handleChangeFloor, arrFloors, modelFloors, selectedFloor };
};
