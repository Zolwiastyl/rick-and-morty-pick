import React, { useEffect } from "react";
import cytoscape, { ElementsDefinition, EdgeDefinition } from "cytoscape";
import { TasksStateProps, Task } from "./types";
import cola from "cytoscape-cola";
import { sendNewTask, callApi, curriedSendNewTask } from "./api";
import { useAuth0 } from "./react-auth0-spa";
import { Auth0Client } from "@auth0/auth0-spa-js";

cytoscape.use(cola);

function prepareElementsForGraph(tasks: Task[]) {
  const nodes = tasks.map((t) => {
    return { data: { id: t.frontEndId, label: t.name } };
  });
  const edges: EdgeDefinition[] = tasks
    .map((t) => {
      return t.dependencyId.map((id) => {
        const newEdge: EdgeDefinition = {
          data: { source: t.frontEndId, target: id },
          selectable: true,
        };
        return newEdge;
      });
    })
    .flat(1);
  const elements: ElementsDefinition = { nodes: nodes, edges: edges };
  console.log(elements);
  return elements;
}

function renderCytoscapeElement(
  { tasks, setTasks }: TasksStateProps,
  client: Auth0Client | undefined
) {
  /**
   * requires only task that's need to be sent.
   */

  const cy = cytoscape({
    container: document.getElementById("cy-placeholder"),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: [
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
    ],
    layout: {
      name: "breadthfirst",
      directed: true,
      padding: 5,
      spacingFactor: 1.25,
      animate: true,
    },
    elements: prepareElementsForGraph(tasks),
  });
  console.log("renderCytoscapeElement runs");
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
        console.log(tasks);
        const sourceTaskToSave: Task = {
          ...tasks.find((t) => t.frontEndId == firstNode)!,
          dependencyId: tasks
            .find((t) => t.frontEndId == firstNode)!
            .dependencyId.concat([evt.target.id()]),
        };
        const targetTaskToSave: Task = {
          ...tasks.find((t) => t.frontEndId == evt.target.id())!,
          dependOnThisTask: tasks
            .find((t) => t.frontEndId == evt.target.id())!
            .dependOnThisTask.concat([firstNode]),
        };
        const bufforArray = tasks
          .filter(
            (t) =>
              t.frontEndId !== firstNode && t.frontEndId !== evt.target.id()
          )
          .concat([sourceTaskToSave])
          .concat([targetTaskToSave]);

        if (
          callApi(client, curriedSendNewTask(sourceTaskToSave)) &&
          callApi(client, curriedSendNewTask(targetTaskToSave))
        ) {
          setTasks(bufforArray);
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
    console.log(newEdge.id());
    console.log(newEdge.isEdge());
    newEdge
      .connectedNodes()
      .toArray()
      .map((t) => console.log(t.id()));
    newEdge
      .target()
      .toArray()
      .map((t) => console.log(t.id()));
    console.log(
      newEdge
        .target()
        .toArray()
        .filter((t) => t.id() != undefined)[0]
    );
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

  useEffect(() => {
    renderCytoscapeElement({ tasks, setTasks }, client);
  }, [tasks]);
  return (
    <div>
      <button> layout </button>
      <div style={cyStyle} id="cy-placeholder">
        placeholder
      </div>
    </div>
  );
}
