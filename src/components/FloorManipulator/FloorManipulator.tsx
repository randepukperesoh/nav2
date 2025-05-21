export const FloorManipulator = ({
  arrFloors,
  handleChangeFloor,
  selectedFloor,
}: {
  arrFloors: number[];
  selectedFloor: number;
  handleChangeFloor: (i: number) => void;
}) => {
  return (
    <div className="floorManipulator">
      <div className="floorHead">Этажи</div>
      {arrFloors.map((el, i) => (
        <div
          onClick={() => handleChangeFloor(i)}
          key={"floor_" + i}
          className={`floorItem ${
            i === selectedFloor ? "floorItem_selected" : ""
          }`}
        >
          {el}
        </div>
      ))}
    </div>
  );
};
