/** @jsx jsx */
import { useRef, useEffect, MutableRefObject } from "react";
import { jsx } from "@emotion/core";
import cytoscape, { Core, ElementDefinition } from "cytoscape";

function useCytoscape() {
  const container = useRef(null);
  const ref = useRef(cytoscape());
  useEffect(() => {
    if (container.current) {
      ref.current = cytoscape({
        container: container.current,
      });
      return () => {
        ref.current.destroy();
        ref.current = cytoscape();
      };
    }
  }, []);
  return {
    cy: ref,
    container,
  };
}

const nodes = [
  {
    data: { id: "one", label: "Node 1" },
    position: { x: 100, y: 100 },
  },
  {
    data: { id: "two", label: "Node 2" },
    position: { x: 100, y: 200 },
  },
];

/** @param {cytoscape.Core} cy */
function useTaskNodes(cy: MutableRefObject<Core>, nodes: ElementDefinition[]) {
  useEffect(() => {
    console.log({ cy, nodes });
    if (!cy) {
      return;
    }
    cy.current.add(nodes);
    return () => {
      cy.current.remove(cy.current.elements());
    };
  }, [cy, nodes]);
}

export default function App() {
  const { container, cy } = useCytoscape();
  useTaskNodes(cy, nodes);

  return (
    <div
      className="App"
      css={{
        canvas: {
          background: "salmon",
          width: 400,
          height: 400,
        },
      }}
    >
      <h1>Siemano Kuba</h1>
      <div ref={container} style={{ height: 400 }} />
    </div>
  );
}
