export class Graph {
    adjacencyList: { [key: string]: { node: string; weight: number }[] } = {};

    addVertex(vertex: string): void {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1: string, vertex2: string, weight: number): void {
        if (this.adjacencyList[vertex1] && this.adjacencyList[vertex2]) {
            this.adjacencyList[vertex1].push({ node: vertex2, weight });
            this.adjacencyList[vertex2].push({ node: vertex1, weight }); // Если граф неориентированный
        }
    }

    dijkstra(start: string, finish: string): string[] {
        const nodes = new PriorityQueue();
        const distances: { [key: string]: number } = {};
        const previous: { [key: string]: string | null } = {};
        const path: string[] = []; // Для хранения кратчайшего пути
        let smallest: string | undefined;

        // Инициализация состояний
        for (const vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }

        // Процесс поиска кратчайшего пути
        while (nodes.values.length) {
            smallest = nodes.dequeue()?.val;
            if (smallest === finish) {
                // Построение пути
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (smallest && distances[smallest] !== Infinity) {
                for (const neighbor of this.adjacencyList[smallest]) {
                    const nextNode = neighbor;
                    const candidate = distances[smallest] + nextNode.weight;
                    const nextNeighbor = nextNode.node;
                    if (candidate < distances[nextNeighbor]) {
                        distances[nextNeighbor] = candidate;
                        previous[nextNeighbor] = smallest;
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        return path.concat(smallest ?? []).reverse();
    }
}

export class PriorityQueue {
    values: Node[] = [];

    enqueue(val: string, priority: number): void {
        const newNode = new Node(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }

    bubbleUp(): void {
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);
            const parent = this.values[parentIdx];
            if (element.priority >= parent.priority) break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }

    dequeue(): Node | undefined {
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0 && end) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }

    sinkDown(): void {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            const leftChildIdx = 2 * idx + 1;
            const rightChildIdx = 2 * idx + 2;
            let leftChild: Node | undefined, rightChild: Node | undefined;
            let swap: number | null = null;

            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < (leftChild?.priority ?? Infinity))
                ) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}

class Node {
    val: string;
    priority: number;

    constructor(val: string, priority: number) {
        this.val = val;
        this.priority = priority;
    }
}
