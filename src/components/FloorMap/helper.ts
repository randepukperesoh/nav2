import type { Position } from "../../types";

export const getFloorDefaultPosition = (floor: number): Position => {
  switch (floor) {
    case 0:
      return [-10, 72, 0] as Position;
    case 1:
      return [0.5, 70, 33.5] as Position;
    case 2:
      return [5.5, 78, 38.5] as Position;
    case 3:
      return [10.5, 86, 43.5] as Position;
    case 4:
      return [15.5, 94, 48.5] as Position;
    case 5:
      return [20, 122, -30] as Position;
    case 6:
      return [25, 130, -25] as Position;
    case 7:
      return [90, 130, -50] as Position;
    case 8:
      return [100, 106, -20] as Position;
    default:
      return [0, 70, 0] as Position;
  }
};