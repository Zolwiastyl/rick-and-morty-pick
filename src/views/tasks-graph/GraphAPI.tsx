import { EdgeDefinition, ElementDefinition,NodeDefinition } from "cytoscape";

import { Task } from "../../types";

export function prepareElementsForGraph(tasks: Task[]) {
	const nodes: NodeDefinition[] = tasks.map((t) => {
		return { data: { id: t.frontEndId, label: t.name, classes: t.status } };
	});
	const edges: EdgeDefinition[] = tasks
		.map((t) => {
			return t.dependOnThisTask.map(
				(id): EdgeDefinition => {
					return {
						data: {
							source: t.frontEndId,
							target: id,
							id: `${t.frontEndId}->${id}`,
						},
						selectable: true,
					};
				}
			);
		})
		.flat(10);
	const elements: ElementDefinition[] = nodes.concat(edges);
	console.log(elements);
	return elements;
}

export const graphStyle: cytoscape.Stylesheet[] = [
	{
		selector: "node",
		style: {
			height: 80,
			width: 80,
			"background-fit": "cover",
			"border-color": "inherit",
			"border-width": 5,
			"border-opacity": 0.1,

			label: "data(label)",
			"text-max-width": "15em",
			"text-wrap": "wrap",
			"text-halign": "left",
			"text-valign": "top",
			"text-outline-color": "white",
			"text-outline-width": 3,
			"text-outline-opacity": 1,
			"text-events": "yes",
		},
	},
	{
		selector: "edge",
		style: {
			width: 7,
			"target-arrow-shape": "triangle",
			"curve-style": "bezier",
		},
	},
];

export function copyTaskById(tasks: Task[], id: string): Task {
	return tasks.find((t) => t.frontEndId === id)!;
}
