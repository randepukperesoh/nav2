import { useGLTF } from "@react-three/drei";
import { useRouteStore } from "../components/store/store";

const MOCK_PATHS = ["/dstu_0.glb", "/dstu_1.glb", "/dstu_2.glb", "/dstu_3.glb", "/dstu_4.glb", "/dstu_5.glb", "/dstu_6.glb", "/dstu_7.glb", "/dstu_8.glb"];

export const useFloorLoader = () => {

  const {setCurrentFloor, currentFloor} = useRouteStore()

  const modelFloors = useGLTF(MOCK_PATHS);

  const handleChangeFloor = (i: number) => {setCurrentFloor(i)}

  const arrFloors = MOCK_PATHS.map((_, i) => i);

  const selectedFloor = modelFloors[currentFloor];

  return { floorNumber: currentFloor, handleChangeFloor, arrFloors, modelFloors, selectedFloor };
};
