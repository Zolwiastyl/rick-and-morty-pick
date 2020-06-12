import React, { useEffect, useRef, MutableRefObject } from "react";
import cytoscape, { Core, ElementDefinition, LayoutOptions } from "cytoscape";
import { Task, TaskId } from "../../types";
import cola from "cytoscape-cola";
import { useAuth0 } from "../../react-auth0-spa";
import { Auth0Client } from "@auth0/auth0-spa-js";
import { prepareElementsForGraph, graphStyle } from "./GraphAPI";

cytoscape.use(cola);

const breadthfirstLayout: LayoutOptions = {
	name: "breadthfirst",
	directed: true,
	padding: 5,
	spacingFactor: 1.25,
	animate: true,
};

interface ActionHandlers {
	addEdge(from: TaskId, to: TaskId): void;
	removeEdge(from: TaskId, to: TaskId): void;
}

function renderCytoscapeElement(
	initialTasks: Task[],
	{ addEdge, removeEdge }: ActionHandlers,
	client: Auth0Client | undefined,
	container: MutableRefObject<null>
) {
	/**
	 * requires only task that's need to be sent.
	 */
	const cy = cytoscape({
		container: container.current,

		boxSelectionEnabled: false,
		autounselectify: true,

		style: graphStyle,
		layout: breadthfirstLayout,
		elements: prepareElementsForGraph(initialTasks),
	});

	cy.maxZoom(2.5);
	cy.minZoom(0.5);
	return cy;
}

// export function BruteGraph({ tasks, setTasks }: TasksStateProps) {
// 	let cyStyle = {
// 		height: "800px",
// 		width: "1900px",
// 		margin: "20px 0px",
// 	};
// 	const { client } = useAuth0();
// 	const container = useRef(null);
// 	useEffect(() => {
// 		try {
// 			renderCytoscapeElement(tasks, {  }, client, container);
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	}, [tasks]);
// 	return (
// 		<div>
// 			<button> layout </button>
// 			<div style={cyStyle} ref={container} id="cy-placeholder">
// 				something went wrong with generaing graph
// 			</div>
// 		</div>
// 	);
// }

interface TasksGraphProps extends ActionHandlers {
	tasks: Task[];
}

export function TasksGraph({ addEdge, removeEdge, tasks }: TasksGraphProps) {
	const { client } = useAuth0();
	const { container, cy } = useCytoscape(
		tasks,
		{ addEdge, removeEdge },
		client
	);
	useTaskNodes(cy, prepareElementsForGraph(tasks));

	return <div ref={container} className="w-full h-screen"></div>;
}

function useCytoscape(
	initialTasks: Task[],
	actionHandlers: ActionHandlers,
	client: Auth0Client | undefined
) {
	const container = useRef(null);
	const ref = useRef<cytoscape.Core>((undefined as any) as cytoscape.Core);
	if (!ref.current) {
		ref.current = cytoscape({});
	}
	const { addEdge, removeEdge } = actionHandlers;

	useEffect(() => {
		if (container.current) {
			ref.current = renderCytoscapeElement(
				initialTasks,
				{ addEdge, removeEdge },
				client,
				container
			);
			ref.current.on("render", "node", () => {
				ref.current?.layout(breadthfirstLayout).run();
			});
			return () => {
				ref.current?.destroy();
				ref.current = cytoscape({});
			};
		}
	}, [addEdge, client, initialTasks, removeEdge]);

	const firstEdgeNodeId = useRef<TaskId | undefined>();

	// register event handlers
	useEffect(() => {
		const cy = ref.current;

		console.log("event handlers refreshed");

		cy.on("tap", (evt) => {
			console.log("tapped");
			if (evt.target === cy) {
				console.log("clearing firstNodeEdgeId");
				firstEdgeNodeId.current = undefined;
			}
		});

		cy.on("tap", "node", (evt) => {
			console.log("node clicked");

			if (!firstEdgeNodeId.current) {
				console.log("setting firstNodeEdgeId", evt.target.id());
				firstEdgeNodeId.current = evt.target.id();
			} else {
				console.log("setting targetId");
				const targetId = evt.target.id();
				if (firstEdgeNodeId.current !== targetId) {
					addEdge(firstEdgeNodeId.current, targetId);
				}
				firstEdgeNodeId.current = undefined;
			}
		});

		cy.on("tap", "edge", (evt) => {
			const newEdge = cy.getElementById(evt.target.id());

			removeEdge(
				newEdge
					.source()
					.toArray()
					.map((t) => t.id())[0],
				newEdge
					.target()
					.toArray()
					.map((t) => t.id())[0]
			);
		});

		return () => {
			cy.removeListener("tap");
			cy.removeListener("tap", "node");
			cy.removeListener("tap", "edge");
		};
	}, [addEdge, removeEdge]);

	return {
		cy: ref,
		container,
	};
}

function useTaskNodes(
	cy: MutableRefObject<Core>,
	newElements: ElementDefinition[]
) {
	useEffect(() => {
		if (!cy) {
			return;
		}

		const currentElements = cy.current.elements().toArray();
		console.log({ currentElements });
		console.log({ newElements });

		const currentIds = new Set(currentElements.map((x) => x.id()));
		const newIds = new Set(newElements.map((x) => x.data.id!));

		const added = newElements.filter(
			(x) => x.data.id && !currentIds.has(x.data.id)
		);
		const removed = currentElements.filter((x) => !newIds.has(x.id()));

		console.log({
			currentIds,
			newIds,
			added,
			removed,
		});

		cy.current.add(added);
		removed.forEach((x) => cy.current.remove(x));
	}, [cy, newElements]);
}