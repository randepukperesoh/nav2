import { useGLTF } from "@react-three/drei";

const path = "/environment.glb";

export const useEnvitonmentLoader = () => {
  const model = useGLTF(path);
  return {model}
};
