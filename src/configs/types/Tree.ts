import { EdgeDefinition, NodeDefinition, Position } from 'cytoscape';

export type CytoscapeTree = {
  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
  pan?: Position;
};

export type Tree = {
  uid: string;
  corpus: string;
  document: string;
  page: string;
  sentence: string;
  expression: string;
  next: string;
  previous: string;
  cytoscape: CytoscapeTree;
};
