import type { FC } from "react";
import { Modal } from "../ThreeModal/Modal";
import { Plane, Text } from "@react-three/drei";
import { useRouteStore } from "../store/store";

export interface IDot {
  position: [number, number, number];
  name: string;
  args: [number, number, number];
}

interface IRoom {
  room: IDot;
}

export const Room: FC<IRoom> = ({ room }) => {
  const { position, name, args } = room;

  const { setStartId, setEndId } = useRouteStore();

  return (
    <mesh key={name} position={position}>
      <Modal
        renderProp={(setIsOpen) => (
          <div className="modal_room">
            <div>{name}</div>
            <div className="modal_room_btns">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setStartId(name);
                }}
              >
                Я здесь
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setEndId(name);
                }}
              >
                Маршрут
              </button>
            </div>
          </div>
        )}
      >
        <Plane rotation={[-Math.PI / 2, 0, 0]} args={args} scale={2} />
      </Modal>
      <Text color={"black"}>{name}</Text>
    </mesh>
  );
};
