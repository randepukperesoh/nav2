import type { FC } from "react";

interface IRoomTag {
  startId: string | null;
  endId: string | null;
  name: string;
  setEndId: (val: string) => void;
  setStartId: (val: string) => void;
}

export const RoomTag: FC<IRoomTag> = ({
  startId,
  name,
  setEndId,
  setStartId,
}) => {
  const handlePoints = (value: string) => {
    if (startId) {
      setEndId(value);
    } else if (!startId) {
      setStartId(value);
    } else {
      setEndId(value);
    }
  };

  return (
    <div className="roomTag" onClick={() => handlePoints(name)}>
      {name}
    </div>
  );
};
