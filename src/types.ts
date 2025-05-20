export type Position = [number, number, number];
export type Segment = { id: number; start: Position; end: Position };
export type NamedPoint = { name: string; position: Position };
export type NamedPoints = { names: NamedPoint[] };
