import "./App.css";
import { Canvas, useThree } from "@react-three/fiber";
import {
  CameraControls,
  Edges,
  OrbitControls,
  Plane,
  Text,
  TrackballControls,
} from "@react-three/drei";
import campusData from "./assets/campusData.json";

interface ICoridors {
  id: string;
  name: string;
  start: { x: number; y: number; z: number };
  width: number;
  depth: number;
}

interface IRoom {
  id: string;
  number: string;
  coordinates: { x: number; y: number };
  size: { width: number; depth: number };
}

const Room = ({ room }: { room: IRoom }) => {
  const textRotation: [number, number, number] = [-Math.PI / 2, 0, 0]; // Поворачиваем текст на 90 градусов вниз

  return (
    <mesh position={[room.coordinates.x, 0, room.coordinates.y]}>
      <boxGeometry args={[room.size.width, 1, room.size.depth]} />
      <meshStandardMaterial color="lightblue" />

      <Text
        position={[0, 1, 0]}
        anchorX="center"
        anchorY="middle"
        color="black"
        fontSize={3.5}
        rotation={textRotation}
      >
        {room.number}
      </Text>

      <Edges threshold={60}>
        <boxGeometry args={[room.size.width, 1, room.size.depth]} />
      </Edges>
    </mesh>
  );
};

// const Corridor = ({ corridor }: { corridor: ICoridors }) => {
//   const [start, end] = corridor.path.map(
//     (el) => [el.x, el.y, el.z] as [number, number, number]
//   );
//   return (
//     <mesh
//       // ref={meshRef}
//       position={start}
//     >
//       <boxGeometry args={[50, 0.5, 5]} />
//       <meshStandardMaterial color="red" />
//     </mesh>
//   );
// };

// import React, { useMemo } from "react";
// import { Vector3 } from "three";

// const Corridor = ({ corridor }: { corridor: ICoridors }) => {
//   const [start, end] = corridor.path.map((el) => new Vector3(el.x, el.y, el.z));

//   const width = start.x - end.x;
//   const height = start.y - end.y;
//   const depth = start.z - end.z;

//   return (
//     <Box
//       rotation={[0, 0, Math.PI / 2]}
//       position={start}
//       args={[width, 5, depth]}
//     />
//     // <mesh key={"i+"} position={start}>
//     //   <boxGeometry args={[1, 0, distance]} />
//     //   <meshStandardMaterial color="red" />
//     // </mesh>
//   );
// };

import * as THREE from "three";
import { useEffect } from "react";
import { buildRoute } from "./i";
import { useCreateRoute } from "./useCreateRoute";

const Corridor = ({ corridor }: { corridor: ICoridors }) => {
  const { x, y, z } = corridor.start;
  const { depth, width } = corridor;

  const geometry = new THREE.PlaneGeometry(corridor.width, corridor.depth);

  return (
    <Plane
      position={[x + width / 2, y, z + depth / 2]}
      args={[width, depth]}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
};

// const Transition = ({ transition }) => {
//   const startPoint = new THREE.Vector3(
//     transition.startCoordinates.x,
//     0,
//     transition.startCoordinates.y
//   );
//   const endPoint = new THREE.Vector3(
//     transition.endCoordinates.x,
//     0,
//     transition.endCoordinates.y
//   );
//   const points = [startPoint, endPoint];
//   const geometry = new THREE.BufferGeometry().setFromPoints(points);
//   const material = new THREE.LineBasicMaterial({
//     color: 0xff0000,
//     linewidth: 2,
//   });

//   return <line geometry={geometry} material={material} />;
// };

// const Staircase = ({ staircase }) => {
//   const startPoint = new THREE.Vector3(
//     staircase.startCoordinates.x,
//     0,
//     staircase.startCoordinates.y
//   );
//   const endPoint = new THREE.Vector3(
//     staircase.endCoordinates.x,
//     1,
//     staircase.endCoordinates.y
//   );
//   const points = [startPoint, endPoint];
//   const geometry = new THREE.BufferGeometry().setFromPoints(points);
//   const material = new THREE.LineBasicMaterial({
//     color: 0x00ff00,
//     linewidth: 2,
//   });

//   return <line geometry={geometry} material={material} />;
// };

const TopViewCameraControls = () => {
  const { camera } = useThree();

  // Начальная позиция камеры сверху
  camera.position.set(0, 80, 0);
  camera.up.set(0, 1, 0); // Устанавливаем верхнюю сторону камеры вдоль оси Z
  camera.lookAt(0, 0, 0); // Камера смотрит в центр сцены

  return (
    <CameraControls />
    // <TrackballControls
    //   noRotate={true} // Отключаем вращение
    //   // noPan={false} // Разрешаем перемещение
    //   dynamicDampingFactor={0.25}
    // />
  );
};

import { Line } from "@react-three/drei";

const RouteVisualization = () => {
  const { points } = useCreateRoute();

  if (points.length < 2) return null;

  return (
    <>
      <Line points={points} color="hotpink" lineWidth={1} worldUnits={true} />
    </>
  );
};

const FloorMap = () => {
  const floor = campusData.buildings[0].floors[0];

  return (
    <Canvas camera={{ position: [50, 10, 50], fov: 90 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* <OrbitControls /> */}
      <RouteVisualization />
      <TopViewCameraControls />
      {floor.rooms.map((room) => (
        <Room key={room.id} room={room} />
      ))}
      {floor.corridors.map((corridor) => (
        <Corridor key={corridor.id} corridor={corridor} />
      ))}
      {/* {floor.transitions.map((transition) => (
        <Transition key={transition.id} transition={transition} />
      ))}
      {floor.staircases.map((staircase) => (
        <Staircase key={staircase.id} staircase={staircase} />
      ))} */}
    </Canvas>
  );
};

const App = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FloorMap />
    </div>
  );
};

export default App;
