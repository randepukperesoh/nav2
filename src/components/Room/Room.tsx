import type { FC } from "react";
import { Modal } from "../Modal/Modal";
import { Plane, Text } from "@react-three/drei";
import { useRouteStore } from "../store/store";
import { useSearchRoom } from "../../hooks/useSearchRoom";
import { RouteIcon } from "./RouteIcon";

export interface IDot {
  position: [number, number, number];
  name: string;
}

interface IRoom {
  room: IDot;
}

export const Room: FC<IRoom> = ({ room }) => {
  const { position, name } = room;

  const { setStartId, setEndId, startId, endId } = useRouteStore();

  const { filteredDots, searchName, setSearchName } = useSearchRoom();

  return (
    <mesh key={name} position={position}>
      <Modal
        renderProp={() => (
          <div className="modalRoute">
            <div className="modalRoute_route">
              <div>{startId}</div>
              <RouteIcon />
              <div>{endId}</div>
            </div>
            <input
              className="modalRoute_input"
              value={searchName}
              onChange={(e) => setSearchName(e.currentTarget.value)}
            />

            <div className="modalRoute_cards">
              {filteredDots.map((el) => (
                <div
                  className="modalRoute_cards_room"
                  onClick={() =>
                    startId ? setStartId(el.id) : setEndId(el.id)
                  }
                >
                  {el.name}
                </div>
              ))}
            </div>
          </div>
        )}
      >
        <Plane
          rotation={[-Math.PI / 2, 0, 0]}
          args={[2.5, 3.5]}
          onClick={() => console.log(name)}
          scale={2}
        />
      </Modal>
      <Text color={"black"}>{name}</Text>
    </mesh>
  );
};
