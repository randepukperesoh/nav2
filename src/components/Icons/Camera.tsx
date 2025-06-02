import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Position } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Константы для настройки плавности
const SMOOTHNESS = 0.10; // Более плавное управление
const RETURN_DELAY = 3000;
const TRANSITION_TIME = 1500; // Увеличили время анимации

export const Camera = ({
  position = [0.5, 70, 33.5],
  target = [0.5, 0, 33.5],
}: {
  position: Position;
  target: Position;
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [userControlling, setUserControlling] = useState(false);
  const lastInteraction = useRef(Date.now());
  const animationRef = useRef<number>(undefined);

  // Состояния для плавного перехода
  const [autoPosition, setAutoPosition] = useState(new THREE.Vector3(...position));
  const [autoTarget, setAutoTarget] = useState(new THREE.Vector3(...target));

  // Инициализация
  useEffect(() => {
    camera.position.copy(autoPosition);
    camera.lookAt(autoTarget);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(autoTarget);
      controls.update();

      const onStart = () => {
        setUserControlling(true);
        lastInteraction.current = Date.now();
        cancelAnimation();
      };

      const onEnd = () => {
        lastInteraction.current = Date.now();
        setTimeout(checkAutoReturn, RETURN_DELAY);
      };

      controls.addEventListener('start', onStart);
      controls.addEventListener('end', onEnd);

      return () => {
        controls.removeEventListener('start', onStart);
        controls.removeEventListener('end', onEnd);
        cancelAnimation();
      };
    }
  }, []);

  const checkAutoReturn = () => {
    if (Date.now() - lastInteraction.current >= RETURN_DELAY) {
      setUserControlling(false);
      startAnimation();
    }
  };

  // Обновление целевых точек
  useEffect(() => {
    setAutoPosition(new THREE.Vector3(...position));
    setAutoTarget(new THREE.Vector3(...target));
    
    if (!userControlling) {
      startAnimation();
    }
  }, [position, target]);

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  const startAnimation = () => {
    cancelAnimation();

    const startPos = new THREE.Vector3().copy(camera.position);
    const startTarget = new THREE.Vector3().copy(controlsRef.current?.target || autoTarget);
    
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / TRANSITION_TIME, 1);

      const easedProgress = easeInOutCubic(progress);
      
      // Плавное перемещение камеры
      camera.position.lerpVectors(startPos, autoPosition, easedProgress);
      
      if (controlsRef.current) {
        // Плавное перемещение цели
        controlsRef.current.target.lerpVectors(startTarget, autoTarget, easedProgress);
        controlsRef.current.update();
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };


  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 40, 10]} intensity={1} />
      <PerspectiveCamera near={0.1} far={1000} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={true}
        minDistance={30}
        maxDistance={400}
        minPolarAngle={0}
        maxPolarAngle={0}
        minAzimuthAngle={-0}
        maxAzimuthAngle={0}
        enableDamping={true}
        dampingFactor={SMOOTHNESS}
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
