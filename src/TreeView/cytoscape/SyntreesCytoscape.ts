import cytoscape, { Core } from "cytoscape";
import nodeHtmlLabel from "cytoscape-node-edge-html-label";
import { CytoscapeTree } from "../../configs/types/Tree";
import defaultStylesheet from "./CytoscapeStylesheet";
nodeHtmlLabel(cytoscape);

type Props = {
  selector: string;
  tree: CytoscapeTree;
  stylesheet?: cytoscape.StylesheetCSS[];
  dagre?: boolean;
  wheelSensitivity?: number;
  onReady?: (cy: Core) => void;
  autoungrabify?: boolean;
};

const init = ({
  selector,
  tree,
  dagre = false,
  stylesheet = defaultStylesheet,
  wheelSensitivity = 1.5,
  onReady,
  autoungrabify = true,
}: Props): Core => {
  destroy(selector);

  const cy = cytoscape({
    container: document.getElementById(selector),
    layout: { name: "preset" },
    elements: { nodes: tree.nodes || [], edges: tree.edges || [] },
    style: stylesheet,
    zoom: 2,
    pan: tree.pan || { x: 100, y: 100 },
    minZoom: 1e-50,
    maxZoom: 1e50,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: "single",
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify,
    autounselectify: false,
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity,
    pixelRatio: 1,
  });

  cy.on("mouseover", "node", () => {
    cy.container()?.style.setProperty("cursor", "pointer");
  });
  cy.on("mouseout", "node", () => {
    cy.container()?.style.setProperty("cursor", "default");
  });

  cy.ready(() => {
    if (!(cy as any)._htmlLabelsApplied) {
      const nodesToLabel = cy.nodes(".token");

      // @ts-ignore (no types)
      cy.nodeHtmlLabel([
        {
          query: nodesToLabel,
          halign: "center",
          valign: "center",
          tpl: (data: any) =>
            `<div class="token-data ${data.classes || ""}">${data.label}</div>`,
        },
      ]);

      (cy as any)._htmlLabelsApplied = true; // mark as applied
    }

    cy.fit();
    cy.center();
    dagre && cy.layout({ name: "dagre" }).run();
    onReady && onReady(cy);
  });

  return cy;
};

const destroy = (selector: string) => {
  const el = document.getElementById(selector);
  if (el) el.innerHTML = "";
};

const SyntreesCytoscape = {
  init,
};

export default SyntreesCytoscape;
