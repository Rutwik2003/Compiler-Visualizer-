import { useState } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface ParserStep {
  description: string;
  rule: string;
}

export function useParseTree() {
  const [parseTree, setParseTree] = useState<TreeNode | null>(null);

  const generateParseTree = (expression: string) => {
    const tokens = expression.split(/(\d+|\+|\-|\*|\/|\(|\))/).filter(t => t.trim());
    const parser = new Parser(tokens);
    const tree = parser.parse();
    setParseTree(tree);
    visualizeTree(tree, parser.steps);
  };

  return { parseTree, generateParseTree };
}

class Parser {
  private tokens: string[];
  private position: number;
  public steps: ParserStep[];

  constructor(tokens: string[]) {
    this.tokens = tokens;
    this.position = 0;
    this.steps = [];
  }

  private peek(): string | null {
    return this.position < this.tokens.length ? this.tokens[this.position] : null;
  }

  private consume(expected?: string): string {
    if (this.position >= this.tokens.length) {
      throw new Error('Unexpected end of input');
    }
    if (expected && this.peek() !== expected) {
      throw new Error(`Expected ${expected} but found ${this.peek()}`);
    }
    return this.tokens[this.position++];
  }

  public parse(): TreeNode {
    return this.parseExpression();
  }

  private parseExpression(): TreeNode {
    let node = this.parseTerm();
    while (this.peek() === '+' || this.peek() === '-') {
      const operator = this.consume();
      const right = this.parseTerm();
      node = {
        name: operator,
        children: [node, right]
      };
      this.steps.push({
        description: `Combining terms with ${operator}`,
        rule: `expression → expression ${operator} term`
      });
    }
    return node;
  }

  private parseTerm(): TreeNode {
    let node = this.parseFactor();
    while (this.peek() === '*' || this.peek() === '/') {
      const operator = this.consume();
      const right = this.parseFactor();
      node = {
        name: operator,
        children: [node, right]
      };
      this.steps.push({
        description: `Applying ${operator} operation`,
        rule: `term → term ${operator} factor`
      });
    }
    return node;
  }

  private parseFactor(): TreeNode {
    if (this.peek() === '(') {
      this.consume('(');
      const node = this.parseExpression();
      this.consume(')');
      this.steps.push({
        description: 'Processing parenthesized expression',
        rule: 'factor → ( expression )'
      });
      return node;
    }
    
    const token = this.consume();
    if (/^\d+$/.test(token)) {
      this.steps.push({
        description: `Found number: ${token}`,
        rule: 'factor → number'
      });
      return { name: token };
    }
    
    throw new Error(`Unexpected token: ${token}`);
  }
}

function visualizeTree(treeData: TreeNode, steps: ParserStep[]) {
  // Clear previous visualizations
  d3.select("#tree").selectAll("*").remove();
  const stepsDiv = document.getElementById("parsing-steps");
  if (stepsDiv) stepsDiv.innerHTML = "";

  // Set up the tree visualization
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

  const svg = d3.select("#tree")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create the tree layout
  const treeLayout = d3.tree<TreeNode>()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

  // Create the root node and generate the tree
  const root = d3.hierarchy(treeData);
  const tree = treeLayout(root);

  // Add the links
  svg.selectAll(".link")
    .data(tree.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkVertical<any, any>()
      .x(d => d.x)
      .y(d => d.y))
    .attr("fill", "none")
    .attr("stroke", "#666")
    .attr("stroke-width", 1.5);

  // Add the nodes
  const node = svg.selectAll(".node")
    .data(tree.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  // Add circles for nodes
  node.append("circle")
    .attr("r", 6)
    .attr("fill", "#4299e1")
    .attr("stroke", "#2b6cb0")
    .attr("stroke-width", 1.5);

  // Add labels
  node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -8 : 8)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .attr("fill", "currentColor")
    .attr("font-size", "12px");

  // Display parsing steps
  if (stepsDiv) {
    steps.forEach((step, index) => {
      const stepElement = document.createElement("div");
      stepElement.className = "mb-2 p-2 rounded";
      stepElement.innerHTML = `
        <div class="font-medium">Step ${index + 1}: ${step.description}</div>
        <div class="text-sm opacity-75">${step.rule}</div>
      `;
      stepsDiv.appendChild(stepElement);
    });
  }
}