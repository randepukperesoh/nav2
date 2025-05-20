import { useEffect, useState } from "react";
import { Graph } from "../graph";
import { calculateDistance, namedPoints, positionToString, segments } from "../helper";

export function useShortestPath(startName: string, finishName: string) {
    const [shortestPath, setShortestPath] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const graph = new Graph();

            // Добавляем вершины и ребра для сегментов
            segments.forEach(segment => {
                const startVertex = positionToString(segment.start);
                const endVertex = positionToString(segment.end);
                const weight = calculateDistance(segment.start, segment.end);

                graph.addVertex(startVertex);
                graph.addVertex(endVertex);
                graph.addEdge(startVertex, endVertex, weight);
            });

            // Добавляем вершины для именованных точек
            namedPoints.names.forEach(namedPoint => {
                const pointVertex = positionToString(namedPoint.position);
                graph.addVertex(pointVertex);
            });

            // Добавляем ребра между именованными точками и ближайшими сегментами
            namedPoints.names.forEach(namedPoint => {
                const pointVertex = positionToString(namedPoint.position);
                segments.forEach(segment => {
                    const startVertex = positionToString(segment.start);
                    const endVertex = positionToString(segment.end);

                    const distanceToStart = calculateDistance(namedPoint.position, segment.start);
                    const distanceToEnd = calculateDistance(namedPoint.position, segment.end);

                    if (distanceToStart < distanceToEnd) {
                        graph.addEdge(pointVertex, startVertex, distanceToStart);
                    } else {
                        graph.addEdge(pointVertex, endVertex, distanceToEnd);
                    }
                });
            });

            // Найдем самый короткий путь из "startName" в "finishName"
            const startVertex = namedPoints.names.find(point => point.name === startName)?.position;
            const finishVertex = namedPoints.names.find(point => point.name === finishName)?.position;

            if (startVertex && finishVertex) {
                const startVertexStr = positionToString(startVertex);
                const finishVertexStr = positionToString(finishVertex);

                const path = graph.dijkstra(startVertexStr, finishVertexStr);
                setShortestPath(path);
            } else {
                setError("Начальная или конечная точка не найдена.");
            }
        } catch (err) {
            setError("Произошла ошибка при вычислении кратчайшего пути." + err);
        }
    }, [startName, finishName]);

    return { shortestPath, error };
}