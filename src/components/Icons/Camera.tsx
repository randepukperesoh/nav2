import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { Position } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Константы для настройки плавности
const SMOOTHNESS = 0.1; // Чем меньше, тем плавнее (0.05-0.2)
const RETURN_DELAY = 3000; // 3 сек до возврата в авторежим
const TRANSITION_TIME = 1500; // 1.5 сек на перемещение

export const Camera = ({
  position = [0.5, 300, 33.5],
  target = [0.5, 0, 33.5],
}: {
  position: Position;
  target: Position;
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [userControlling, setUserControlling] = useState(false);
  const lastInteraction = useRef(Date.now());
  const animationRef = useRef<number | undefined>(0);

  // Точки для плавного перемещения
  const targetPoints = {
    startPos: new THREE.Vector3().copy(camera.position),
    endPos: new THREE.Vector3(...position),
    startTarget: new THREE.Vector3().copy(
      controlsRef.current?.target || new THREE.Vector3()
    ),
    endTarget: new THREE.Vector3(...target),
  };

  // Инициализация и обработчики
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(new THREE.Vector3(...target));

    const controls = controlsRef.current;
    if (controls) {
      controls.target.set(...target);
      controls.update();

      const onControlStart = () => {
        setUserControlling(true);
        lastInteraction.current = Date.now();
        cancelAnimation();
      };

      const onControlEnd = () => {
        lastInteraction.current = Date.now();
        setTimeout(() => {
          if (Date.now() - lastInteraction.current >= RETURN_DELAY) {
            setUserControlling(false);
            startAnimation();
          }
        }, RETURN_DELAY);
      };

      controls.addEventListener("start", onControlStart);
      controls.addEventListener("end", onControlEnd);

      return () => {
        controls.removeEventListener("start", onControlStart);
        controls.removeEventListener("end", onControlEnd);
        cancelAnimation();
      };
    }
  }, []);

  // Обновление точек перемещения при изменении позиции/цели
  useEffect(() => {
    if (userControlling) return;

    targetPoints.startPos.copy(camera.position);
    targetPoints.endPos.set(...position);
    targetPoints.startTarget.copy(
      controlsRef.current?.target || new THREE.Vector3()
    );
    targetPoints.endTarget.set(...target);

    startAnimation();
  }, [position, target]);

  const cancelAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  const startAnimation = () => {
    cancelAnimation();

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / TRANSITION_TIME, 1);

      // Плавное движение с easing
      const easedProgress = easeInOutCubic(progress);

      camera.position.lerpVectors(
        targetPoints.startPos,
        targetPoints.endPos,
        easedProgress
      );

      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(
          targetPoints.startTarget,
          targetPoints.endTarget,
          easedProgress
        );
        controlsRef.current.update();
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = undefined;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Функция плавности (easing)
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 40, 10]} intensity={1} />
      <PerspectiveCamera makeDefault near={0.1} far={1000} />
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
