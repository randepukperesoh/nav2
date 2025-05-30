import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Position } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from 'three';

export const Camera = ({
  position = [0.5, 79, 33.5],
  target = [0.5, 9, 33.5],
}: {
  position: Position;
  target: Position;
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [userControlling, setUserControlling] = useState(false);
  const lastUpdateTime = useRef(0);

  // Инициализация камеры и контролов
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(new THREE.Vector3(...target));
    
    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }

    // Обработчики для определения пользовательского управления
    const onStart = () => {
      setUserControlling(true);
      lastUpdateTime.current = Date.now();
    };

    const onEnd = () => {
      setTimeout(() => {
        if (Date.now() - lastUpdateTime.current > 2000) {
          setUserControlling(false);
        }
      }, 2000);
    };

    const controls = controlsRef.current;
    controls?.addEventListener('start', onStart);
    controls?.addEventListener('end', onEnd);

    return () => {
      controls?.removeEventListener('start', onStart);
      controls?.removeEventListener('end', onEnd);
    };
  }, []);

  // Плавное перемещение камеры, когда пользователь не управляет
  useEffect(() => {
    if (userControlling) return;

    const targetVec = new THREE.Vector3(...target);
    const positionVec = new THREE.Vector3(...position);
    const duration = 1000; // 1 секунда для перемещения
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);

      camera.position.lerpVectors(
        camera.position, 
        positionVec, 
        progress
      );
      
      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(
          controlsRef.current.target,
          targetVec,
          progress
        );
        controlsRef.current.update();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [position, target, userControlling]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <PerspectiveCamera
        makeDefault
        near={0.1}
        far={1000}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={true}
        minDistance={30}
        maxDistance={300}
        minPolarAngle={0}
        maxPolarAngle={0}
        minAzimuthAngle={-0}
        maxAzimuthAngle={0}
        enableDamping={true}
        dampingFactor={0.25}
        enableZoom={true}
        zoomSpeed={1.2}
        enablePan={true}
        panSpeed={1.0}
        screenSpacePanning={true}
        keyPanSpeed={7.0}
        autoRotate={false}
        autoRotateSpeed={2.0}
        mouseButtons={{
          LEFT: 2,
          MIDDLE: 1,
          RIGHT: 0,
        }}
        touches={{
          ONE: 1,
          TWO: 2,
        }}
      />
    </>
  );
};