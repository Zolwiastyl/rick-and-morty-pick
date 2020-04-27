import React, { useEffect } from "react";
import cytoscape, {
  NodeDefinition,
  ElementsDefinition,
  EdgeDefinition,
} from "cytoscape";
import { Layout } from "react-feather";
import { TasksStateProps, Task } from "./types";
import cola from "cytoscape-cola";
import { TasksGraph } from "./TasksGraph";

const mockUpTasks: Task[] = require("./mockup-for-graph.json");
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
        };
        return newEdge;
      });
    })
    .flat(1);
  const elements: ElementsDefinition = { nodes: nodes, edges: edges };
  console.log(elements);
  return elements;
}

function renderCytoscapeElement({ tasks, setTasks }: TasksStateProps) {
  const cy = cytoscape({
    container: document.getElementById("cy-placeholder"),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: [
      {
        selector: "node",
        style: {
          "background-color": "red",
          height: 80,
          width: 80,
          "background-fit": "cover",
          "border-color": "#000",
          "border-width": 3,
          "border-opacity": 0.5,
          content: "data(label)",
          "text-valign": "center",
        },
      },
      {
        selector: "edge",
        style: {
          width: 6,
          "target-arrow-shape": "triangle",
          "line-color": "#ffaaaa",
          "target-arrow-color": "#ffaaaa",
          "curve-style": "bezier",
        },
      },
    ],
    layout: {
      name: "breadthfirst",
      directed: true,
      padding: 10,
      animate: true,
    },
    elements: prepareElementsForGraph(tasks),
  });
  console.log("renderCytoscapeElement runs");
  let firstNode: string;

  let startedAddingEdge: boolean = false;
  cy.on("tap", "node", function (evt) {
    if (!startedAddingEdge) {
      firstNode = evt.target.id();
    } else {
      console.log(tasks);
      const newArray = tasks.slice();

      const diffrentArray = tasks
        .filter(
          (t) => t.frontEndId !== firstNode && t.frontEndId !== evt.target.id()
        )
        .concat([
          {
            ...tasks.find((t) => t.frontEndId == firstNode)!,
            dependencyId: tasks
              .find((t) => t.frontEndId == firstNode)!
              .dependencyId.concat([evt.target.id()]),
          },
        ])
        .concat([
          {
            ...tasks.find((t) => t.frontEndId == evt.target.id())!,
            dependOnThisTask: tasks
              .find((t) => t.frontEndId == evt.target.id())!
              .dependOnThisTask.concat([firstNode]),
          },
        ]);
      setTasks(diffrentArray);
      console.log(tasks);
      console.log(tasks.map((t) => diffrentArray.includes(t)));

      cy.add({
        group: "edges",
        data: { source: firstNode, target: evt.target.id() },
      });
    }
    startedAddingEdge = !startedAddingEdge;
  });
  return cy;
}

export function BruteGraph({ tasks, setTasks }: TasksStateProps) {
  let cyStyle = {
    height: "500px",
    width: "500px",
    margin: "20px 0px",
  };

  useEffect(() => {
    renderCytoscapeElement({ tasks, setTasks });
  }, []);
  return (
    <div>
      <button> layout </button>
      <div style={cyStyle} id="cy-placeholder">
        placeholder
      </div>
    </div>
  );
}

/*{
      nodes: [
        { data: { id: "cat" } },
        { data: { id: "bird" } },
        { data: { id: "ladybug" } },
        { data: { id: "aphid" } },
        { data: { id: "rose" } },
        { data: { id: "grasshopper" } },
        { data: { id: "plant" } },
        { data: { id: "wheat" } },
      ],
      edges: [
        { data: { source: "cat", target: "bird" } },
        { data: { source: "bird", target: "ladybug" } },
        { data: { source: "bird", target: "grasshopper" } },
        { data: { source: "grasshopper", target: "plant" } },
        { data: { source: "grasshopper", target: "wheat" } },
        { data: { source: "ladybug", target: "aphid" } },
        { data: { source: "aphid", target: "rose" } },
      ],
    },

    */
