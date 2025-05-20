import type { NamedPoints, Position, Segment } from "./types";

// utils.ts
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

// Данные о сегментах
export const segments: Segment[] = [
    { "id": 4, "start": [-50, 10, 33.5], "end": [-68, 10, 33.5] },
    { "id": 1, "start": [-68, 10, 33.5], "end": [-68, 10, 1] }
];

// Данные о именованных точках
export const namedPoints: NamedPoints = {
    "names": [
        { "name": "1-143", "position": [-50, 10, 33.5] },
        { "name": "1-143a", "position": [-40, 10, 40] },
        { "name": "1-149", "position": [-30, 10, 40] },
        { "name": "1-122", "position": [-68, 10, 1] } 
    ]
};
