import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three-stdlib';
import { useRouteStore } from '../components/store/store';

const MOCK_PATHS = [
  '/dstu_0.glb',
  '/dstu_1.glb',
  '/dstu_2.glb',
  '/dstu_3.glb',
  '/dstu_4.glb',
  '/dstu_5.glb',
  '/dstu_6.glb',
  '/dstu_7.glb',
  '/dstu_8.glb',
];

export const useFloorLoader = () => {
  const { setCurrentFloor, currentFloor } = useRouteStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modelFloors, setModelFloors] = useState<any>([]);

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();

    const loadModels = async () => {
      const models = [];
      const totalItems = MOCK_PATHS.length;

      for (let i = 0; i < totalItems; i++) {
        try {
          const gltf = await new Promise((resolve, reject) => {
            loader.load(
              MOCK_PATHS[i],
              (gltf) => resolve(gltf),
              (xhr) => {
                const newProgress = Math.round(((xhr.loaded / xhr.total) * 100) / totalItems) + (i * (100 / totalItems));
                setProgress(newProgress);
              },
              (error) => reject(error)
            );
          });
          if (isMounted) {
            models.push(gltf);
          }
        } catch (error) {
          console.error(`Failed to load model ${MOCK_PATHS[i]}:`, error);
        }
      }

      if (isMounted) {
        setModelFloors(models);
        setIsLoading(false);
      }
    };

    loadModels();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChangeFloor = (i: number) => {
    setCurrentFloor(i);
  };

  const arrFloors = MOCK_PATHS.map((_, i) => i);

  const selectedFloor = modelFloors[currentFloor];

  return {
    floorNumber: currentFloor,
    handleChangeFloor,
    arrFloors,
    modelFloors,
    selectedFloor,
    isLoading,
    progress,
  };
};