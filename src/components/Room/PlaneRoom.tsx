import { Plane } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";

export const PlaneRoom = ({
  args,
  rotation,
}: {
  args: [number, number, number];
  rotation?: number;
}) => {
  const [shiny, setShiny] = useState(false);

  const transparentMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.0,
  });

  const shinyMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
  });

  return (
    <Plane
      material={shiny ? shinyMaterial : transparentMaterial}
      rotation={[-Math.PI / 2, 0, rotation ? rotation : 0]}
      args={args}
      scale={2}
      onPointerEnter={() => setShiny(true)}
      onPointerLeave={() => setShiny(false)}
    />
  );
};
