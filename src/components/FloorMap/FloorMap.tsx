import { Canvas } from "@react-three/fiber";
import { useFloorLoader } from "../../hooks/useFloorLoader";
import { FloorManipulator } from "../FloorManipulator/FloorManipulator";
import { Room, type IDot } from "../Room/Room";
import { OrbitControls } from "@react-three/drei";
import dots from "../../assets/names.json";

// export const TopViewCameraControls = () => {
//   const { camera } = useThree();

//   camera.position.set(0, 80, 0);
//   camera.up.set(0, 1, 0);
//   camera.lookAt(0, 0, 0);

//   return <TrackballControls dynamicDampingFactor={0.25} />;
// };

export const FloorMap = () => {
  const {
    arrFloors,
    floorNumber,
    handleChangeFloor,
    // modelFloors,
    selectedFloor,
  } = useFloorLoader();

  return (
    <>
      <FloorManipulator
        handleChangeFloor={handleChangeFloor}
        arrFloors={arrFloors}
      />
      <Canvas camera={{ position: [50, 10, 50], fov: 90 }}>
        <primitive
          object={selectedFloor.scene}
          position={[floorNumber * 5, floorNumber * 5, floorNumber * 5]}
        />
        {dots.names.map((el, i) => (
          <Room key={el.name + "_" + i} room={el as IDot} />
        ))}

        {/* {routes.map((el) => (
          <Line
            key={"i_" + el.id}
            points={[el.end as Position, el.start as Position]}
            color={"pink"}
          />
        ))} */}

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* <RouteVisualization /> */}
        {/* <TopViewCameraControls /> */}
        <OrbitControls />
      </Canvas>
    </>
  );
};
