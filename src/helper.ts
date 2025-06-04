import type { Position } from "./types";

export function calculateDistance(point1: Position, point2: Position): number {
    return Math.sqrt(
        Math.pow(point1[0] - point2[0], 2) +
        Math.pow(point1[1] - point2[1], 2) +
        Math.pow(point1[2] - point2[2], 2)
    );
}

export function positionToString(position: Position): string {
    return position.join(',');
}

export const loadJson = async <T,>(path: string): Promise<T> => {
  const response = await fetch(`/${path}.json`);
  return await response.json();
};
