export interface Edge {
  movie_id: string;
  prerequisite_movie_id: string;
}

export const graphBuilder = (edges: Edge[]): Map<string, string[]> => {
  const graph = new Map<string, string[]>

  for(const e of edges) {
    if(!graph.has(e.movie_id)) {
      graph.set(e.movie_id, [])
    }

    graph.get(e.movie_id)!.push(e.prerequisite_movie_id);
  }

  return graph;
}

export const canReachDFS = (graph: Map<string, string[]>, start: string, target: string): boolean => {
  const visited = new Set<string>();
  const stack = [start];

  while(stack.length > 0) {
    const current = stack.pop();
    if(current === target) return true;
    if(visited.has(current!)) continue;
    visited.add(current!);
    stack.push(...(graph.get(current!) ?? []));
  }

  return false;
}

export const hasCycle = (
  edges: Edge[],
  movie_id: string,
  newPrereqIds: string[],
): boolean => {
  const graph = graphBuilder(edges.filter((e) => e.movie_id !== movie_id));

  return newPrereqIds.some(
    (p) => p === movie_id || canReachDFS(graph, p, movie_id)
  );
}

export const getRewatchOrder = (edges: Edge[], targetId: string): string[] => {
  const graph = graphBuilder(edges);
  const visited = new Set<string>();
  const order: string[] = [];

  const visit = (node: string) => {
    if (visited.has(node)) return;
    visited.add(node);
    for (const prereq of graph.get(node) ?? []) visit(prereq);
    order.push(node); 
  };

  visit(targetId);
  order.pop();
  return order;
};


// const edges: Edge[] = [
//   { movie_id: "Avengers", prerequisite_movie_id: "IronMan" },
//   { movie_id: "Avengers", prerequisite_movie_id: "FirstAvenger" },
//   { movie_id: "CivilWar", prerequisite_movie_id: "Avengers" },
//   { movie_id: "InfinityWar", prerequisite_movie_id: "CivilWar" },
//   { movie_id: "InfinityWar", prerequisite_movie_id: "Ragnarok" },
//   { movie_id: "Endgame", prerequisite_movie_id: "InfinityWar" },
//   { movie_id: "Doomsday", prerequisite_movie_id: "Endgame" },
// ];

// const graph = graphBuilder(edges);
// console.log(graph);

// console.log(getRewatchOrder(edges, "Doomsday"));
// // 7 movies, every movie after its prerequisites

// console.log(getRewatchOrder(edges, "Ragnarok"));
// // []

// console.log(hasCycle(edges, "IronMan", ["Endgame"]));
// // true  -> 409

// console.log(hasCycle(edges, "IronMan", ["Ragnarok"]));