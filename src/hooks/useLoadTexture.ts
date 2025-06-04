import { useLoader } from "@react-three/fiber";
import {
  LinearFilter,
  LinearMipmapLinearFilter,
  RepeatWrapping,
  TextureLoader,
} from "three";

const useLoadTexture = () => {
  const travaTexture = useLoader(TextureLoader, "/texture_trava.jpg");

  travaTexture.wrapS = travaTexture.wrapT = RepeatWrapping;

  travaTexture.repeat.set(100, 100);
  travaTexture.offset.set(0, 0);
  travaTexture.anisotropy = 64;
  travaTexture.minFilter = LinearMipmapLinearFilter;
  travaTexture.magFilter = LinearFilter;

  return { travaTexture };
};

export default useLoadTexture
