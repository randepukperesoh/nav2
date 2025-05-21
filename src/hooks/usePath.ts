import { useEffect, useState } from "react";
import { Graph } from "../graph";
import { calculateDistance, positionToString } from "../helper";
import namedPoints from '../assets/names.json';
import segments from '../assets/routes.json';
import type { Position } from "../types";

export function useShortestPath(startName: string| null, finishName: string| null) {
    const [shortestPath, setShortestPath] = useState<Position[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            
            const graph = new Graph();

            // Добавляем вершины и ребра для сегментов
            segments.forEach(segment => {
                const startVertex = positionToString(segment.start as Position);
                const endVertex = positionToString(segment.end as Position);
                const weight = calculateDistance(segment.start as Position, segment.end as Position);

                graph.addVertex(startVertex);
                graph.addVertex(endVertex);
                graph.addEdge(startVertex, endVertex, weight);
                graph.addEdge(endVertex, startVertex, weight); // Добавляем двунаправленное ребро
            });

            // Добавляем вершины для именованных точек
            namedPoints.names.forEach(namedPoint => {
                const pointVertex = positionToString(namedPoint.position as Position);
                graph.addVertex(pointVertex);
            });

            // Соединяем именованные точки с ближайшими сегментами
            namedPoints.names.forEach(namedPoint => {
                const pointVertex = positionToString(namedPoint.position as Position);
                let closestSegment: null | { vertex: string, distance: string| number } = null;
                let minDistance = Infinity;

                segments.forEach(segment => {
                    const startVertex = positionToString(segment.start as Position);
                    const endVertex = positionToString(segment.end as Position);

                    const distanceToStart = calculateDistance(namedPoint.position as Position, segment.start as Position);
                    const distanceToEnd = calculateDistance(namedPoint.position as Position, segment.end as Position);

                    if (distanceToStart < minDistance) {
                        minDistance = distanceToStart;
                        closestSegment = { vertex: startVertex, distance: distanceToStart };
                    }

                    if (distanceToEnd < minDistance) {
                        minDistance = distanceToEnd;
                        closestSegment = { vertex: endVertex, distance: distanceToEnd };
                    }
                });

                if (closestSegment) {
                    graph.addEdge(pointVertex, closestSegment.vertex, closestSegment.distance);
                }
            });

            // Найдем самый короткий путь из "startName" в "finishName"
            const startVertex = namedPoints.names.find(point => point.name === startName)?.position as Position;
            const finishVertex = namedPoints.names.find(point => point.name === finishName)?.position as Position;

            if (startVertex && finishVertex) {
                const startVertexStr = positionToString(startVertex);
                const finishVertexStr = positionToString(finishVertex);

                const path = graph.dijkstra(startVertexStr, finishVertexStr);
                setShortestPath(path.map(el => el.split(',').map(el => +el) as Position));
            } else {
                setError("Начальная или конечная точка не найдена.");
            }
        } catch (err) {
            setError("Произошла ошибка при вычислении кратчайшего пути: " + err);
        }
    }, [startName, finishName]);

    return { shortestPath, error };
}