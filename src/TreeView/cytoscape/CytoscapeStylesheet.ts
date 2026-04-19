import cytoscape from 'cytoscape';

const defaultStylesheet = [
  {
    selector: 'core',
    style: {
      'selection-box-color': '#ddd',
      'selection-box-opacity': 0.65,
      'selection-box-border-color': '#aaa',
      'selection-box-border-width': 1,
      'active-bg-color': 'black',
      'active-bg-opacity': 0.15,
    },
  },
  {
    selector: 'node',
    style: {
      'background-color': '#FFF',
      width: '50px',
      height: '40px',
      'text-wrap': 'wrap',
      'text-max-width': 120,
      'text-valign': 'center',
      'text-halign': 'center',
      shape: 'rectangle',
    },
  },
  {
    selector: 'node.chunk',
    style: {
      content: 'data(label)',
    },
  },
  {
    selector: 'node.empty',
    style: {
      content: 'data(label)',
    },
  },
  {
    selector: 'node.highlight',
    style: {
      width: '100px',
      'background-color': 'yellow',
    },
  },
  {
    selector: 'edge',
    style: {
      'control-point-distance': 30,
      'control-point-weight': 0.5,
      opacity: 0.9,
      'overlay-padding': '3px',
      'overlay-opacity': 0,
      width: 1,
    },
  },
  {
    selector: ':selected',
    style: {
      'background-color': '#FFF',
      'line-color': 'red',
      'source-arrow-color': 'red',
      'target-arrow-color': 'red',
    },
  },
  {
    selector: '.eh-handle',
    style: {
      'background-color': 'red',
      width: 12,
      height: 12,
      shape: 'ellipse',
      'overlay-opacity': 0,
      'border-width': 12, // makes the handle easier to hit
      'border-opacity': 0,
    },
  },
  {
    selector: '.eh-hover',
    style: {
      'background-color': 'red',
    },
  },
  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': 'red',
    },
  },
  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': 'red',
    },
  },
  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': 'red',
      'line-color': 'red',
      'target-arrow-color': 'red',
      'source-arrow-color': 'red',
    },
  },
  {
    selector: '.eh-ghost-edge.eh-preview-active',
    css: {
      opacity: 0,
    },
  },
] as Array<cytoscape.StylesheetCSS>;

export default defaultStylesheet;
