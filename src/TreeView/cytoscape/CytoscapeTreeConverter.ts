import { EdgeDefinition, NodeDefinition } from 'cytoscape';
import { Chunk, Struct, Token } from '../../configs/types/Struct';
import CytoscapePositionCalculator from './CytoscapePositionCalculator';
import NodeCalculation, { CytoscapeTreeCalculation } from './NodeCalculation';
import TreeLayout from './TreeLayout';

export default class CytoscapeTreeConverter {
  private ID_SPLITTER = '|';
  private extraInfo = false;

  execute(
    struct: Struct,
    extraInfo: boolean
  ): CytoscapeTreeCalculation | undefined {
    if (!this.validate(struct)) return undefined;
    const tree = this.initTree(struct);
    this.extraInfo = extraInfo;
    this.inflate(tree, struct);
    this.calculatePositions(tree);

    return {
      nodes: tree.nodes.map((n) => ({
        data: n.data,
        position: n.position,
        id: n.id,
        classes: n.data.token ? 'token' : 'chunk',
      })),
      edges: tree.edges,
      root: {
        data: tree.root.data,
        position: tree.root.position,
        id: tree.root.id,
      },
    };
  }

  public getLabelLeaf(token: Token): string {
    if (this.extraInfo && token.attributes) {
      const attrLines = Object.values(token.attributes)
        .map((v) =>
          token.split ? this.splitAttributeValue(v, token.split.idx) : v
        )
        .join('<br/>');
      return `<span class="token-value">${token.v}</span><span class="token-attributes">${attrLines}</span>`;
    }
    return `<span class="token-value">${token.v}</span>`;
  }

  private splitAttributeValue(attr: string, idx: number): string {
    const splits = attr.split('+');
    return splits[idx] ? splits[idx] : '';
  }

  private validate(struct: Struct): boolean {
    if (!struct.chunks || struct.chunks.length === 0) {
      return false;
    }

    if (!struct.tokens || struct.tokens.length === 0) {
      return false;
    }

    return struct.tokens.every((token) => {
      if (token.ec) {
        return true;
      }
      return token.t !== undefined && token.t.trim() !== '';
    });
  }

  private calculatePositions(cytoscape: CytoscapeTreeCalculation): void {
    const converter = new CytoscapePositionCalculator();
    const positions = converter.calculatePositions(cytoscape);

    for (const node of cytoscape.nodes) {
      const rect = positions.get(node.id);
      if (!rect) continue;
      node.position = {
        x: rect.x,
        y: rect.y,
      };
    }

    try {
      this.checkLastTokenPosition(cytoscape.nodes);
    } catch (e) {
      // do nothing
    }
  }

  private checkLastTokenPosition(nodes: NodeDefinition[]): void {
    const last = nodes[nodes.length - 1];
    const penult = nodes[nodes.length - 2];
    const antepenult = nodes[nodes.length - 3];

    if ((last.position?.x as number) < (antepenult.position?.x as number)) {
      last.position = {
        y: last.position?.y as number,
        x: (antepenult.position?.x as number) + TreeLayout.MIN_NODE_WIDTH,
      };

      penult.position = {
        y: penult.position?.y as number,
        x: (antepenult.position?.x as number) + TreeLayout.MIN_NODE_WIDTH,
      };
    }
  }

  private inflate(tree: CytoscapeTreeCalculation, struct: Struct): void {
    const chunks = struct.chunks.filter((c) => c.l !== 0);

    for (const chunk of chunks) {
      this.convertChunk(tree, struct, chunk);
      this.removeTemporaryEdges(tree, struct, chunk);
    }

    struct.tokens &&
      struct.tokens
        .filter((t) => t.ec)
        .forEach((t) => {
          const associated = struct.chunks.find((c) =>
            this.isEmptyCategoryInChunk(c, t)
          );

          if (associated) {
            this.convertEmptyCategory(tree, associated, t);
          }
        });
  }

  private isEmptyCategoryInChunk(chunk: Chunk, token: Token): boolean {
    if (chunk.l !== token.l) return false;
    if (token.p >= chunk.i && token.p <= chunk.f) return true;
    return false;
  }

  private convertEmptyCategory(
    tree: CytoscapeTreeCalculation,
    chunk: Chunk,
    token: Token
  ): void {
    const id = this.generateLeafId(token);

    const node: NodeCalculation = {
      id,
      data: {
        id,
        empty: true,
        leaf: true,
        label: this.getLabelValue(token.v, token.coidx),
        token,
      },
    };
    tree.nodes.push(node);

    const source = this.generateChunkId(chunk);

    // adds empty attribute to the chunk
    const nodeChunk = tree.nodes.find((n) => n.id === source);
    if (nodeChunk) nodeChunk.data.chunk.empty = true;

    tree.edges.push({
      data: {
        id: this.uuid(),
        source: source,
        target: node.id,
      },
    });
  }

  private convertChunk(
    tree: CytoscapeTreeCalculation,
    struct: Struct,
    chunk: Chunk
  ): void {
    const nodeId = this.generateChunkId(chunk);

    tree.nodes.push({
      id: nodeId,
      data: {
        id: nodeId,
        label: this.getLabelValue(chunk.t, chunk.coidx, chunk.ep),
        chunk: { ...chunk },
      },
    });

    const parent = this.findParent(struct, chunk);
    if (!parent) return;

    const parentId = this.generateChunkId(parent);
    tree.edges.push({
      data: {
        id: this.uuid(),
        source: parentId,
        target: nodeId,
      },
    });

    const tokens = this.getTokens(struct, chunk);
    for (const token of tokens) {
      if (token.ec) continue;
      tree.edges.push({
        data: {
          id: this.uuid(),
          source: nodeId,
          target: this.generateTokenId(token),
        },
      });
    }
  }

  private removeTemporaryEdges(
    tree: CytoscapeTreeCalculation,
    struct: Struct,
    chunk: Chunk
  ): void {
    let levelCount = 1;
    let leveledChunks = this.getChunksByLevel(struct, chunk, levelCount);

    while (leveledChunks.length > 0) {
      for (const upperChunk of leveledChunks) {
        const upperChunkId = this.generateChunkId(upperChunk);
        for (const token of this.getTokens(struct, chunk)) {
          const tokenId = this.generateTokenId(token);
          tree.edges = [
            ...tree.edges.filter(
              (e: EdgeDefinition) =>
                !(e.data.source === upperChunkId && e.data.target === tokenId)
            ),
          ];
        }
      }
      leveledChunks = this.getChunksByLevel(struct, chunk, levelCount);
      levelCount++;
    }
  }

  private generateChunkId(chunk: Chunk): string {
    return `${chunk.i}${this.ID_SPLITTER}${chunk.f}${this.ID_SPLITTER}${chunk.l}${this.ID_SPLITTER}${chunk.t}`;
  }

  private generateTokenId(token: Token): string {
    const sb = [];

    if (token.p === null) return '0';

    sb.push(`${token.p}`);
    if (token.idx) {
      sb.push('-');
      sb.push(`${token.idx}`);
    }

    if (token.t) {
      sb.push('+');
      sb.push(token.t);
    }

    return sb.join('');
  }

  private generateLeafId(token: Token): string {
    if (token.p === null) return '0';
    return `${token.p}`;
  }

  private findParent(struct: Struct, chunk: Chunk): Chunk | null {
    const chunks = this.getChunksByLevel(struct, chunk, 1);

    if (chunks.length === 0) return null;
    for (const parent of chunks) {
      const tf = chunk.f;
      const ti = chunk.i;
      const ptf = parent.f;
      const pti = parent.i;
      if (tf <= ptf && ti >= pti) return parent;
    }
    return null;
  }

  private initTree(struct: Struct): CytoscapeTreeCalculation {
    this.sortChunks(struct);

    const chunkRoot =
      struct.chunks.length === 1
        ? struct.chunks[0]
        : struct.chunks.find((c) => c.l === 0);

    if (!chunkRoot) throw new Error('struct.root.notfound');
    chunkRoot.l = 0;

    const rootId = this.generateChunkId(chunkRoot);
    const root = {
      id: rootId,
      data: {
        id: rootId,
        label: this.getLabelValue(chunkRoot.t, chunkRoot.coidx, chunkRoot.ep),
        chunk: chunkRoot,
      },
    };

    const tree: CytoscapeTreeCalculation = {
      nodes: [root],
      edges: [],
      root,
    };

    for (let i = chunkRoot.i; i < chunkRoot.f + 1; i++) {
      const token = struct.tokens.find((t) => t.p === i);
      if (!token) continue;
      this.convertToken(tree, struct, token);
    }

    return tree;
  }

  private sortChunks(struct: Struct): void {
    struct.chunks.sort((chunk1, chunk2) => {
      if (chunk1.l !== chunk2.l) {
        return chunk1.l - chunk2.l;
      }
      if (chunk1.i !== chunk2.i) {
        return chunk1.i - chunk2.i;
      }
      return chunk1.f - chunk2.f;
    });
  }

  private convertToken(
    tree: CytoscapeTreeCalculation,
    struct: Struct,
    token: Token
  ): void {
    if (token.ec) return;

    let id = this.generateTokenId(token);
    const tag = {
      id,
      data: {
        id,
        label: this.getLabelValue(token.t, token.coidx),
        token: JSON.parse(JSON.stringify(token)),
      },
    };
    tree.nodes.push(tag);

    tree.edges.push({
      data: {
        id: this.uuid(),
        source: tree.root.id,
        target: tag.id,
      },
    });

    // replicate the attributes in all splits
    if (token.split && !token.split.v) {
      const prevToken = struct.tokens.find((t) => t.p === token.p - 1);
      if (prevToken && prevToken.attributes) {
        token.attributes = prevToken.attributes;
      }
    }

    id = this.generateLeafId(token);
    const word = {
      id,
      data: {
        id,
        leaf: true,
        label: this.getLabelLeaf(token),
        token: JSON.parse(JSON.stringify(token)),
      },
    };
    tree.nodes.push(word);

    tree.edges.push({
      data: {
        id: this.uuid(),
        source: tag.id,
        target: word.id,
      },
    });
  }

  private getTokens(struct: Struct, chunk: Chunk): Token[] {
    const ti = chunk.i;
    const tf = chunk.f;
    if (ti === null || tf === null || tf < ti) return [];

    const tokens = this.sortTokens(struct.tokens);
    return tokens.slice(ti - 1, tf);
  }

  private getLabelValue(
    value: string | undefined,
    coidx?: number[],
    ep?: boolean
  ): string {
    let idxLabel = '';
    if (coidx) {
      for (const idx of coidx) {
        idxLabel += `${ep ? '=' : '-'}${idx.toString()}`;
      }
    }
    return (value || '') + idxLabel;
  }

  private getChunksByLevel(
    struct: Struct,
    chunk: Chunk,
    level: number
  ): Chunk[] {
    return struct.chunks.filter((c) => c.l === chunk.l - level);
  }

  private sortTokens(tokens: Token[]): Token[] {
    return tokens
      .slice() // Create a shallow copy to avoid modifying the original array
      .sort((o1, o2) => {
        if (o1.p === null || o2.p === null) return -1;
        return o1.p - o2.p;
      });
  }

  private uuid() {
    return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
      /* eslint-disable */
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      /* eslint-enable */
      return v.toString(16);
    });
  }
}
