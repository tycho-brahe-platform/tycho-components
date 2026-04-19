declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare module 'cytoscape-node-edge-html-label' {
  import cytoscape from 'cytoscape';
  export default function register(cytoscape: typeof cytoscape): void;
}
