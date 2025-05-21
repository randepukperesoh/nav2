import { Canvas } from "@react-three/fiber";
import { useFloorLoader } from "../../hooks/useFloorLoader";
import { FloorManipulator } from "../FloorManipulator/FloorManipulator";
import { Room, type IDot } from "../Room/Room";
import { OrbitControls } from "@react-three/drei";
import dots from "../../assets/names.json";
import { useShortestPath } from "../../hooks/usePath";
import { useRouteStore } from "../store/store";
import { AnimatedLine } from "../AnimtedLine/AnimatedLine";
import { RouteModal } from "../RouteModal/RouteModal";
import { useGetPathFromParam } from "../../hooks/useGetPathFromParam";

export const FloorMap = () => {
  const {
    arrFloors,
    floorNumber,
    handleChangeFloor,
    // modelFloors,
    selectedFloor,
  } = useFloorLoader();

  const { startId, endId } = useRouteStore();

  const { shortestPath: routes } = useShortestPath(startId, endId);

  useGetPathFromParam();

  return (
    <>
      <FloorManipulator
        selectedFloor={floorNumber}
        handleChangeFloor={handleChangeFloor}
        arrFloors={arrFloors}
      />
      <RouteModal />
      <Canvas camera={{ position: [50, 10, 50], fov: 90 }}>
        <primitive
          object={selectedFloor.scene}
          position={[floorNumber * 5, floorNumber * 5, floorNumber * 5]}
        />
        {dots.names.map((el, i) => (
          <Room key={el.name + "_" + i} room={el as IDot} />
        ))}

        {routes.length > 0 && <AnimatedLine points={routes} />}

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
      </Canvas>
    </>
  );
};
