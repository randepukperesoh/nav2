import type { FC } from "react";
import { Modal } from "../ThreeModal/Modal";
import { Text } from "@react-three/drei";
import { useRouteStore } from "../store/store";
import { PlaneRoom } from "./PlaneRoom";
import { animated } from "@react-spring/three";

export interface IDot {
  position: [number, number, number];
  name: string;
  args: [number, number, number];
  rotation?: number;
}

interface IRoom {
  room: IDot;
  openModalName: string | null;
  setOpenModalName: (val: string | null) => void;
}

export const Room: FC<IRoom> = ({ room, openModalName, setOpenModalName }) => {
  const { position, name, args, rotation } = room;
  const { setStartId, setEndId } = useRouteStore();
  const isOpen = openModalName === name;

  return (
    <animated.mesh key={name} position={position}>
      <Modal
        currentRoom={name} // Передаем текущую комнату
        setModalName={() => setOpenModalName(name)}
        isOpen={isOpen}
        setOpenModalName={setOpenModalName}
        renderProp={(handleClose) => (
          <div className="modal_room">
            <div>{name}</div>
            <div className="modal_room_btns">
              <button
                className="romm_btn"
                onClick={() => {
                  handleClose();
                  setStartId(name);
                }}
              >
                Я здесь
              </button>
              <button
                className="romm_btn"
                onClick={() => {
                  handleClose();
                  setEndId(name);
                }}
              >
                Маршрут
              </button>
            </div>
          </div>
        )}
      >
        <PlaneRoom rotation={rotation} args={args} />
      </Modal>
      <Text
        color={"black"}
        rotation={[-Math.PI / 2, 0, rotation ? rotation : 0]}
      >
        {name}
      </Text>
    </animated.mesh>
  );
};