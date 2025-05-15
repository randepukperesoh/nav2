export type Point = { x: number; y: number };

type Room = {
  id: string;
  coordinates: Point;
  size: { width: number; depth: number };
  number: string;
};

type Corridor = {
  id: string;
  start: Point;
  width: number;
  depth: number;
};

function isPointInCorridor(point: Point, corridor: Corridor): boolean {
  const leftX = corridor.start.x;
  const rightX = corridor.start.x + corridor.width;
  const bottomY = corridor.start.y;
  const topY = corridor.start.y + corridor.depth;

  return (
    point.x >= leftX &&
    point.x <= rightX &&
    point.y >= bottomY &&
    point.y <= topY
  );
}

// Возвращает ближайшую точку на периметре коридора к заданной точке
function getClosestPointOnCorridor(point: Point, corridor: Corridor): Point {
  const clampedX = Math.max(
    corridor.start.x,
    Math.min(point.x, corridor.start.x + corridor.width)
  );
  const clampedY = Math.max(
    corridor.start.y,
    Math.min(point.y, corridor.start.y + corridor.depth)
  );

  return { x: clampedX, y: clampedY };
}

// Определяем точку входа в комнату — ближайшую к коридорам
function getRoomEntryPoint(room: Room, corridors: Corridor[]): Point {
  const roomCenter = {
    x: room.coordinates.x + room.size.width / 2,
    y: room.coordinates.y + room.size.depth / 2,
  };

  // Находим ближайший коридор
  let minDistance = Infinity;
  let closestPoint: Point | null = null;

  for (const corridor of corridors) {
    const cx = corridor.start.x + corridor.width / 2;
    const cy = corridor.start.y + corridor.depth / 2;
    const distance = Math.hypot(roomCenter.x - cx, roomCenter.y - cy);

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = { x: cx, y: cy };
    }
  }

  return closestPoint || roomCenter;
}

// Проверяем, пересекаются ли коридоры
function doCorridorsOverlap(c1: Corridor, c2: Corridor): boolean {
  const r1Left = c1.start.x;
  const r1Right = c1.start.x + c1.width;
  const r1Bottom = c1.start.y;
  const r1Top = c1.start.y + c1.depth;

  const r2Left = c2.start.x;
  const r2Right = c2.start.x + c2.width;
  const r2Bottom = c2.start.y;
  const r2Top = c2.start.y + c2.depth;

  return !(
    r1Right < r2Left ||
    r2Right < r1Left ||
    r1Top < r2Bottom ||
    r2Top < r1Bottom
  );
}

// Строим граф смежности коридоров
function buildGraph(corridors: Corridor[]) {
  const graph: Record<string, string[]> = {};

  corridors.forEach((c1) => {
    graph[c1.id] = [];
    corridors.forEach((c2) => {
      if (c1.id !== c2.id && doCorridorsOverlap(c1, c2)) {
        graph[c1.id].push(c2.id);
      }
    });
  });

  return graph;
}

// Поиск кратчайшего пути (BFS)
function findShortestPath(
  corridors: Corridor[],
  startCorridorId: string,
  endCorridorId: string
): string[] {
  const graph = buildGraph(corridors);
  const queue = [{ node: startCorridorId, path: [startCorridorId] }];
  const visited = new Set([startCorridorId]);

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (node === endCorridorId) {
      return path;
    }

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return []; // путь не найден
}

// Основная функция
export function buildRoute(
  data: any,
  fromRoomNumber: string,
  toRoomNumber: string
): Point[] {
  const rooms: Room[] = data.buildings[0].floors[0].rooms;
  const corridors: Corridor[] = data.buildings[0].floors[0].corridors;

  const fromRoom = rooms.find((r) => r.number === fromRoomNumber);
  const toRoom = rooms.find((r) => r.number === toRoomNumber);

  if (!fromRoom || !toRoom) {
    throw new Error("Комната не найдена");
  }

  const startPoint = getRoomEntryPoint(fromRoom, corridors);
  const endPoint = getRoomEntryPoint(toRoom, corridors);

  let startCorridor = null;
  let endCorridor = null;

  for (const cor of corridors) {
    if (isPointInCorridor(startPoint, cor)) startCorridor = cor;
    if (isPointInCorridor(endPoint, cor)) endCorridor = cor;
  }

  // Если точка не в коридоре — ищем ближайшую точку на коридоре
  if (!startCorridor) {
    console.warn("Начальная точка вне коридора, ищем ближайшую...");
    let minDist = Infinity;
    for (const cor of corridors) {
      const p = getClosestPointOnCorridor(startPoint, cor);
      const dist = Math.hypot(p.x - startPoint.x, p.y - startPoint.y);
      if (dist < minDist) {
        minDist = dist;
        startCorridor = cor;
        startPoint.x = p.x;
        startPoint.y = p.y;
      }
    }
  }

  if (!endCorridor) {
    console.warn("Конечная точка вне коридора, ищем ближайшую...");
    let minDist = Infinity;
    for (const cor of corridors) {
      const p = getClosestPointOnCorridor(endPoint, cor);
      const dist = Math.hypot(p.x - endPoint.x, p.y - endPoint.y);
      if (dist < minDist) {
        minDist = dist;
        endCorridor = cor;
        endPoint.x = p.x;
        endPoint.y = p.y;
      }
    }
  }

  if (!startCorridor || !endCorridor) {
    throw new Error(
      "Не удалось определить коридоры для начальной или конечной точки"
    );
  }

  const corridorPath = findShortestPath(
    corridors,
    startCorridor.id,
    endCorridor.id
  );

  const route: Point[] = [startPoint];

  for (let i = 0; i < corridorPath.length - 1; i++) {
    const currentCorridor = corridors.find((c) => c.id === corridorPath[i])!;
    const nextCorridor = corridors.find((c) => c.id === corridorPath[i + 1])!;

    // Точка пересечения коридоров
    const minX = Math.max(currentCorridor.start.x, nextCorridor.start.x);
    const maxX =
      Math.min(
        currentCorridor.start.x + currentCorridor.width,
        nextCorridor.start.x + nextCorridor.width
      ) || minX;

    const minY = Math.max(currentCorridor.start.y, nextCorridor.start.y);
    const maxY =
      Math.min(
        currentCorridor.start.y + currentCorridor.depth,
        nextCorridor.start.y + nextCorridor.depth
      ) || minY;

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    route.push({ x: midX, y: midY });
  }

  route.push(endPoint);

  return route;
}
