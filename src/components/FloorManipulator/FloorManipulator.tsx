export const FloorManipulator = ({
  arrFloors,
  handleChangeFloor,
}: {
  arrFloors: number[];
  handleChangeFloor: (i: number) => void;
}) => {
  return (
    <div className="floorManipulator">
      {arrFloors.map((el, i) => (
        <div
          onClick={() => handleChangeFloor(i)}
          key={"floor_" + i}
          className="floorItem"
        >
          {el}
        </div>
      ))}
    </div>
  );
};
