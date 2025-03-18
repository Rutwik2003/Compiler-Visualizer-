import { useState } from 'react';
import * as d3 from 'd3';
import {
  regexToPostfix,
  thompsonConstruction,
  nfaToDfa,
  syntaxTreeDfa
} from '../utils/automataUtils';

export function useAutomata() {
  const convertToAutomata = (regex: string, method: 'thompson' | 'syntaxTree') => {
    // Clear previous graphs
    d3.select("#nfa-graph").selectAll("*").remove();
    d3.select("#dfa-graph").selectAll("*").remove();
    d3.select("#steps").html("");

    if (method === 'thompson') {
      const postfix = regexToPostfix(regex);
      const { nfa, steps: nfaSteps } = thompsonConstruction(postfix);
      const { dfa, steps: dfaSteps } = nfaToDfa(nfa);

      // Collect states and links for visualization
      const nfaStates: any[] = [];
      const nfaLinks: any[] = [];
      const visited = new Set();
      const queue = [nfa.start];

      while (queue.length) {
        const state = queue.pop()!;
        if (!visited.has(state.id)) {
          visited.add(state.id);
          nfaStates.push(state);
          for (const symbol in state.transitions) {
            for (const next of state.transitions[symbol]) {
              nfaLinks.push({ source: state, target: next, label: symbol });
              queue.push(next);
            }
          }
        }
      }

      drawNfaGraph(nfaStates, nfaLinks, nfa.accept.id, "#nfa-graph");
      drawDfaGraph(dfa, "#dfa-graph");
      
      // Display steps
      const stepsDiv = document.getElementById('steps')!;
      stepsDiv.innerHTML = [
        "<h3>Thompson's Construction Steps:</h3>",
        ...nfaSteps,
        "<h3>NFA to DFA Conversion Steps:</h3>",
        ...dfaSteps
      ].join('<br>');
    } else {
      const { dfa, steps, treeNodes } = syntaxTreeDfa(regex);
      drawSyntaxTree(treeNodes[treeNodes.length - 1], "#nfa-graph");
      drawDfaGraph(dfa, "#dfa-graph");
      
      // Display steps
      const stepsDiv = document.getElementById('steps')!;
      stepsDiv.innerHTML = [
        "<h3>Syntax Tree Construction Steps:</h3>",
        ...steps
      ].join('<br>');
    }
  };

  function drawNfaGraph(states: any[], links: any[], acceptId: number, selector: string) {
    const width = 1100;
    const height = 400;
    const svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Add arrow markers
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#666');

    // Force simulation
    const simulation = d3.forceSimulation(states)
      .force('charge', d3.forceManyBody().strength(-200))
      .force('link', d3.forceLink(links).distance(80))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX().strength(0.1))
      .force('y', d3.forceY().strength(0.1));

    // Create links
    const link = svg.append('g')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('stroke', '#666')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)');

    // Add nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(states)
      .enter().append('circle')
      .attr('r', 12)
      .attr('fill', d => d.id === acceptId ? '#90ee90' : '#add8e6');

    // Add labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(states)
      .enter().append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '10px')
      .attr('fill', '#333');

    const linkLabelGroup = svg.append('g');

    // Update on simulation tick
    simulation.on('tick', () => {
      link.attr('d', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      node
        .attr('cx', d => Math.max(20, Math.min(width - 20, d.x)))
        .attr('cy', d => Math.max(20, Math.min(height - 20, d.y)));

      labels
        .attr('x', d => Math.max(20, Math.min(width - 20, d.x)))
        .attr('y', d => Math.max(20, Math.min(height - 20, d.y)));

      linkLabelGroup.selectAll('text').remove();

      links.forEach(d => {
        const sourceX = Math.max(20, Math.min(width - 20, d.source.x));
        const sourceY = Math.max(20, Math.min(height - 20, d.source.y));
        const targetX = Math.max(20, Math.min(width - 20, d.target.x));
        const targetY = Math.max(20, Math.min(height - 20, d.target.y));

        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dr = dist * 1.5;

        let labelX = (sourceX + targetX) / 2;
        let labelY = (sourceY + targetY) / 2;

        if (dist > 0) {
          const offsetFactor = Math.min(dr * 0.15, 25);
          const offsetX = -dy / dist * offsetFactor;
          const offsetY = dx / dist * offsetFactor;

          labelX += offsetX;
          labelY += offsetY;
        }

        linkLabelGroup.append('text')
          .attr('x', labelX)
          .attr('y', labelY)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('dy', '.35em')
          .attr('fill', '#FFFFFF')
          .text(d.label);
      });
    });
  }

  function drawDfaGraph(dfa: any, selector: string) {
    const width = 1100;
    const height = 400;
    const svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const states = dfa.states.map((state: string) => ({ id: state }));
    const links = [];

    for (const state in dfa.transitions) {
      for (const sym in dfa.transitions[state]) {
        links.push({
          source: states[state],
          target: states[dfa.transitions[state][sym]],
          label: sym
        });
      }
    }

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#666');

    const simulation = d3.forceSimulation(states)
      .force('charge', d3.forceManyBody().strength(-200))
      .force('link', d3.forceLink(links).distance(80).id((d: any) => d.id))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX().strength(0.1))
      .force('y', d3.forceY().strength(0.1));

    const link = svg.append('g')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('stroke', '#666')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)');

    const node = svg.append('g')
      .selectAll('circle')
      .data(states)
      .enter().append('circle')
      .attr('r', 12)
      .attr('fill', d => dfa.accept.includes(parseInt(d.id.slice(1))) ? '#90ee90' : '#add8e6');

    const labels = svg.append('g')
      .selectAll('text')
      .data(states)
      .enter().append('text')
      .text(d => d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '10px')
      .attr('fill', '#333');

    const linkLabelGroup = svg.append('g');

    simulation.on('tick', () => {
      link.attr('d', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      node
        .attr('cx', d => Math.max(20, Math.min(width - 20, d.x)))
        .attr('cy', d => Math.max(20, Math.min(height - 20, d.y)));

      labels
        .attr('x', d => Math.max(20, Math.min(width - 20, d.x)))
        .attr('y', d => Math.max(20, Math.min(height - 20, d.y)));

      linkLabelGroup.selectAll('text').remove();

      links.forEach(d => {
        const sourceX = Math.max(20, Math.min(width - 20, d.source.x));
        const sourceY = Math.max(20, Math.min(height - 20, d.source.y));
        const targetX = Math.max(20, Math.min(width - 20, d.target.x));
        const targetY = Math.max(20, Math.min(height - 20, d.target.y));

        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const dr = dist * 1.5;

        let labelX, labelY;

        if (d.source.id === d.target.id) {
          labelX = sourceX + 25;
          labelY = sourceY - 25;
        } else {
          labelX = (sourceX + targetX) / 2;
          labelY = (sourceY + targetY) / 2;

          if (dist > 0) {
            const offsetFactor = Math.min(dr * 0.15, 25);
            const offsetX = -dy / dist * offsetFactor;
            const offsetY = dx / dist * offsetFactor;

            labelX += offsetX;
            labelY += offsetY;
          }
        }

        linkLabelGroup.append('text')
          .attr('x', labelX)
          .attr('y', labelY)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('dy', '.35em')
          .attr('fill', '#333')
          .text(d.label);
      });
    });
  }

  function drawSyntaxTree(root: any, selector: string) {
    const width = 1100;
    const height = 400;
    const svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', 'translate(50,30)');

    const tree = d3.tree().size([width - 100, height - 60]);
    const hierarchy = d3.hierarchy(root, d => [d.left, d.right].filter(Boolean));
    tree(hierarchy);

    const link = g.selectAll('.link')
      .data(hierarchy.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y))
      .attr('stroke', '#666')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none');

    const node = g.selectAll('.node')
      .data(hierarchy.descendants())
      .enter().append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    node.append('circle')
      .attr('r', 12)
      .attr('fill', '#add8e6');

    node.append('text')
      .text(d => d.data.symbol)
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#333');
  }

  return { convertToAutomata };
}