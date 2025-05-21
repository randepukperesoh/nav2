import "./App.css";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Line,
  OrbitControls,
  Plane,
  Sphere,
  Text,
  TrackballControls,
} from "@react-three/drei";
import { useFloorLoader } from "./hooks/useFloorLoader.ts";
// import campusData from "./assets/campusData.json";
import dots from "./assets/names.json";
import routes from "./assets/routes.json";
import { Modal } from "./components/Modal/Modal.tsx";

export const TopViewCameraControls = () => {
  const { camera } = useThree();

  camera.position.set(0, 80, 0);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);

  return (
    <TrackballControls
      // noRotate={true}
      // noPan={false}
      dynamicDampingFactor={0.25}
    />
  );
};

// const RouteVisualization = () => {
//   const { points } = useCreateRoute();

//   if (points.length < 2) return null;

//   return (
//     <>
//       <Line points={points} color="hotpink" lineWidth={1} worldUnits={true} />
//     </>
//   );
// };

const FloorManipulator = ({
  arrFloors,
  handleChangeFloor,
}: {
  arrFloors: number[];
  handleChangeFloor: (i: number) => void;
}) => {
  return (
    <div className="floorManipulator">
      {arrFloors.map((el, i) => (
        <div
          onClick={() => handleChangeFloor(i)}
          key={"floor_" + i}
          className="floorItem"
        >
          {el}
        </div>
      ))}
    </div>
  );
};

const FloorMap = () => {
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
      {/* {[{positions: [0,0,0]}].map(el => <></mesh>)} */}
      <Canvas camera={{ position: [50, 10, 50], fov: 90 }}>
        <primitive
          object={selectedFloor.scene}
          position={[floorNumber * 5, floorNumber * 5, floorNumber * 5]}
        />
        {dots.names.map((el) => (
          <mesh
            key={el.name}
            position={el.position as [number, number, number]}
          >
            <Modal renderProp={() => <div>{el.name}</div>}>
              <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                args={el.args as [number, number]}
                onClick={() => console.log(el.name)}
                scale={2}
              />
            </Modal>
            <Text color={"black"}>{el.name}</Text>
          </mesh>
        ))}

        {routes.map((el) => (
          <Line key={"i_" + el.id} lineWidth={2} points={[el.end, el.start]} color={"green"} />
        ))}

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* <RouteVisualization /> */}
        {/* <TopViewCameraControls /> */}
        <OrbitControls />
      </Canvas>
    </>
  );
};

const App = () => {
  const corridors = routes;

  const rooms = dots.names;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FloorMap />
    </div>
  );
};

export default App;
