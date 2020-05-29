import React, { useEffect, useRef, MutableRefObject, lazy } from "react";
import cytoscape, {
	CytoscapeOptions,
	Core,
	ElementDefinition,
	LayoutOptions,
} from "cytoscape";
import { TasksStateProps, Task } from "./types";
import cola from "cytoscape-cola";
import { callApi, curriedSendNewTask, sendNewTask } from "./api";
import { useAuth0 } from "./react-auth0-spa";
import { Auth0Client } from "@auth0/auth0-spa-js";
import {
	prepareElementsForGraph,
	makeNewTasksWithDependencies,
	graphStyle,
	sendSourceAndTargetTasks,
	makeNewTasksRemovingDependencies,
	copyTaskById,
} from "./GraphAPI";

cytoscape.use(cola);

function renderCytoscapeElement(
	{ tasks, setTasks }: TasksStateProps,
	client: Auth0Client | undefined,
	container: MutableRefObject<null>
) {
	/**
	 * requires only task that's need to be sent.
	 */
	console.log(tasks);
	const cy = cytoscape({
		container: container.current,

		boxSelectionEnabled: false,
		autounselectify: true,

		style: graphStyle,
		layout: {
			name: "breadthfirst",
			directed: true,
			padding: 5,
			spacingFactor: 1.25,
			animate: true,
		},
		elements: prepareElementsForGraph(tasks),
	});

	let firstNode: string;
	let startedAddingEdge: boolean = false;
	cy.on("tap", (evt) => {
		if (evt.target == cy) {
			startedAddingEdge = false;
		}
	});
	cy.on("tap", "node", function (evt) {
		if (!startedAddingEdge) {
			firstNode = evt.target.id();
		} else {
			if (firstNode != evt.target.id()) {
				const [
					sourceTaskToSave,
					targetTaskToSave,
				] = makeNewTasksWithDependencies(tasks, [
					firstNode,
					evt.target.id(),
				]);

				if (
					sendSourceAndTargetTasks(client, curriedSendNewTask, [
						sourceTaskToSave,
						targetTaskToSave,
					])
				) {
					setTasks(
						tasks
							.filter(
								(t) =>
									t.frontEndId !== firstNode &&
									t.frontEndId !== evt.target.id()
							)
							.concat([sourceTaskToSave, targetTaskToSave])
					);
				} else {
					console.error("couldn't send tasks");
				}
				cy.add({
					group: "edges",
					data: { source: firstNode, target: evt.target.id() },
				});
			} else {
				startedAddingEdge = !startedAddingEdge;
			}
		}
		startedAddingEdge = !startedAddingEdge;
	});
	cy.on("tap", "edge", (evt) => {
		const newEdge = cy.getElementById(evt.target.id());
		const idsOfTasks = [
			newEdge
				.source()
				.toArray()
				.map((t) => t.id()),
			newEdge
				.target()
				.toArray()
				.map((t) => t.id()),
		].flat();
		const [
			sourceTaskToSave,
			targetTaskToSave,
		] = makeNewTasksRemovingDependencies(tasks, idsOfTasks);
		console.log(sourceTaskToSave, targetTaskToSave);
		if (
			sendSourceAndTargetTasks(client, curriedSendNewTask, [
				sourceTaskToSave,
				targetTaskToSave,
			])
		) {
			setTasks(
				tasks
					.filter(
						(t) =>
							t.frontEndId != sourceTaskToSave.frontEndId &&
							t.frontEndId != targetTaskToSave.frontEndId
					)
					.concat([sourceTaskToSave, targetTaskToSave])
			);
		}

		cy.remove(newEdge);
	});
	cy.maxZoom(2.5);
	cy.minZoom(0.5);
	return cy;
}

export function BruteGraph({ tasks, setTasks }: TasksStateProps) {
	let cyStyle = {
		height: "800px",
		width: "1900px",
		margin: "20px 0px",
	};
	const { client } = useAuth0();
	const container = useRef(null);
	useEffect(() => {
		try {
			renderCytoscapeElement({ tasks, setTasks }, client, container);
		} catch (error) {
			console.error(error);
		}
	}, [tasks]);
	return (
		<div>
			<button> layout </button>
			<div style={cyStyle} ref={container} id="cy-placeholder">
				something went wrong with generaing graph
			</div>
		</div>
	);
}

export function TasksGraph({ tasks, setTasks }: TasksStateProps) {
	const { client } = useAuth0();
	const { container, cy } = useCytoscape({ tasks, setTasks }, client);
	useTaskNodes(cy, prepareElementsForGraph(tasks));
	const cyStyle = {
		height: "800px",
		width: "1900px",
		margin: "20px 0px",
	};

	return <div ref={container} style={cyStyle}></div>;
}

const breadthfirstLayout: LayoutOptions = {
	name: "breadthfirst",
	directed: true,
	padding: 5,
	spacingFactor: 1.25,
	animate: true,
};

function useCytoscape(
	{ tasks, setTasks }: TasksStateProps,
	client: Auth0Client | undefined
) {
	const container = useRef(null);
	const ref = useRef(cytoscape({}));
	useEffect(() => {
		if (container.current) {
			ref.current = renderCytoscapeElement(
				{ tasks, setTasks },
				client,
				container
			);
			ref.current.on("render", "node", (evt) => {
				ref.current.layout(breadthfirstLayout).run();
			});
			return () => {
				ref.current.destroy();
				ref.current = cytoscape({});
			};
		}
	}, []);
	return {
		cy: ref,
		container,
	};
}

function useTaskNodes(cy: MutableRefObject<Core>, nodes: ElementDefinition[]) {
	useEffect(() => {
		if (!cy) {
			return;
		}
		cy.current.add(nodes);
		return () => {
			cy.current.remove(cy.current.elements());
		};
	}, [cy, nodes]);
}
