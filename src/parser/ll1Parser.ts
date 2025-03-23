import { ParserSteps, ParseResult, Step } from './types';

export class LL1Parser {
  grammar: { [nonTerminal: string]: string[][] } = {};
  nonTerminals: Set<string> = new Set();
  terminals: Set<string> = new Set();
  first: { [nonTerminal: string]: Set<string> } = {};
  follow: { [nonTerminal: string]: Set<string> } = {};
  parsingTable: { [key: string]: string } = {};
  steps: ParserSteps = {
    leftRecursion: [],
    leftFactoring: [],
    first: {},
    follow: {},
    table: [],
    parsing: []
  };

  constructor(grammarInput: string) {
    this.parseGrammarInput(grammarInput);
    this.removeLeftRecursion();
    this.nonTerminals = new Set(Object.keys(this.grammar));
    this.computeTerminals();
    this.computeFirst();
    this.computeFollow();
    this.buildParsingTable();
  }

  parseGrammarInput(input: string) {
    const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    lines.forEach(line => {
      const [lhs, rhs] = line.split('->').map(s => s.trim());
      const productions = rhs.split('|').map(prod =>
        prod.trim().split(' ').filter(sym => sym.length > 0)
      );
      this.grammar[lhs] = productions;
    });
  }

  removeLeftRecursion() {
    const nonTerminals = Array.from(Object.keys(this.grammar));
    
    for (let i = 0; i < nonTerminals.length; i++) {
      const Ai = nonTerminals[i];
      
      // Remove indirect left recursion
      for (let j = 0; j < i; j++) {
        const Aj = nonTerminals[j];
        const newProductions: string[][] = [];
        
        for (const production of this.grammar[Ai]) {
          if (production[0] === Aj) {
            const beta = production.slice(1);
            for (const gammaProd of this.grammar[Aj]) {
              newProductions.push([...gammaProd, ...beta]);
            }
          } else {
            newProductions.push(production);
          }
        }
        this.grammar[Ai] = newProductions;
      }
      
      // Remove direct left recursion
      const directRecursive: string[][] = [];
      const nonRecursive: string[][] = [];
      
      for (const production of this.grammar[Ai]) {
        if (production[0] === Ai) {
          directRecursive.push(production.slice(1));
        } else {
          nonRecursive.push(production);
        }
      }
      
      if (directRecursive.length > 0) {
        const newNonTerminal = `${Ai}'`;
        this.steps.leftRecursion.push(`Removing left recursion from ${Ai}`);
        this.steps.leftRecursion.push(`Created new non-terminal ${newNonTerminal}`);
        
        // Update productions for Ai
        this.grammar[Ai] = nonRecursive.map(prod => [...prod, newNonTerminal]);
        
        // Add productions for new non-terminal
        this.grammar[newNonTerminal] = [
          ...directRecursive.map(prod => [...prod, newNonTerminal]),
          ['ε']
        ];
      }
    }
  }

  computeTerminals() {
    Object.entries(this.grammar).forEach(([nt, productions]) => {
      productions.forEach(prod => {
        prod.forEach(symbol => {
          if (!this.grammar[symbol] && symbol !== 'ε') {
            this.terminals.add(symbol);
          }
        });
      });
    });
    this.terminals.add('$');
  }

  computeFirst() {
    for (const nt of this.nonTerminals) {
      this.first[nt] = new Set();
    }

    let changed = true;
    while (changed) {
      changed = false;
      for (const nt of this.nonTerminals) {
        for (const production of this.grammar[nt]) {
          if (production[0] === 'ε') {
            if (!this.first[nt].has('ε')) {
              this.first[nt].add('ε');
              changed = true;
            }
          } else {
            let allCanBeEmpty = true;
            for (const symbol of production) {
              if (this.nonTerminals.has(symbol)) {
                const beforeSize = this.first[nt].size;
                this.first[symbol].forEach(s => {
                  if (s !== 'ε') {
                    this.first[nt].add(s);
                  }
                });
                if (!this.first[symbol].has('ε')) {
                  allCanBeEmpty = false;
                  break;
                }
                if (this.first[nt].size > beforeSize) changed = true;
              } else {
                if (symbol !== 'ε') {
                  if (!this.first[nt].has(symbol)) {
                    this.first[nt].add(symbol);
                    changed = true;
                  }
                  allCanBeEmpty = false;
                }
                break;
              }
            }
            if (allCanBeEmpty && !this.first[nt].has('ε')) {
              this.first[nt].add('ε');
              changed = true;
            }
          }
        }
      }
    }
    this.steps.first = this.first;
  }

  computeFollow() {
    for (const nt of this.nonTerminals) {
      this.follow[nt] = new Set();
    }
    const startSymbol = Array.from(this.nonTerminals)[0];
    this.follow[startSymbol].add('$');

    let changed = true;
    while (changed) {
      changed = false;
      for (const nt in this.grammar) {
        for (const production of this.grammar[nt]) {
          for (let i = 0; i < production.length; i++) {
            const symbol = production[i];
            if (this.nonTerminals.has(symbol)) {
              const beforeSize = this.follow[symbol].size;
              let betaFirst = new Set<string>();
              let allEpsilon = true;
              
              for (let j = i + 1; j < production.length; j++) {
                const nextSymbol = production[j];
                if (this.nonTerminals.has(nextSymbol)) {
                  this.first[nextSymbol].forEach(s => {
                    if (s !== 'ε') betaFirst.add(s);
                  });
                  if (!this.first[nextSymbol].has('ε')) {
                    allEpsilon = false;
                    break;
                  }
                } else if (nextSymbol !== 'ε') {
                  betaFirst.add(nextSymbol);
                  allEpsilon = false;
                  break;
                }
              }
              
              betaFirst.forEach(s => {
                if (!this.follow[symbol].has(s)) {
                  this.follow[symbol].add(s);
                  changed = true;
                }
              });
              
              if (allEpsilon || i === production.length - 1) {
                this.follow[nt].forEach(s => {
                  if (!this.follow[symbol].has(s)) {
                    this.follow[symbol].add(s);
                    changed = true;
                  }
                });
              }
            }
          }
        }
      }
    }
    this.steps.follow = this.follow;
  }

  buildParsingTable() {
    for (const nt of this.nonTerminals) {
      for (const production of this.grammar[nt]) {
        const firstSet = this.getFirstOfString(production);
        
        firstSet.forEach(terminal => {
          if (terminal !== 'ε') {
            const key = `${nt},${terminal}`;
            if (this.parsingTable[key] && this.parsingTable[key] !== production.join(' ')) {
              throw new Error(`Grammar is not LL(1): Conflict at ${nt} for terminal ${terminal}`);
            }
            this.parsingTable[key] = production.join(' ');
          }
        });
        
        if (firstSet.has('ε')) {
          this.follow[nt].forEach(terminal => {
            const key = `${nt},${terminal}`;
            if (this.parsingTable[key] && this.parsingTable[key] !== production.join(' ')) {
              throw new Error(`Grammar is not LL(1): Conflict at ${nt} for terminal ${terminal}`);
            }
            this.parsingTable[key] = production.join(' ');
          });
        }
      }
    }
    this.steps.table.push('Parsing table built successfully.');
  }

  getFirstOfString(symbols: string[]): Set<string> {
    const result = new Set<string>();
    
    if (symbols.length === 0 || symbols[0] === 'ε') {
      result.add('ε');
      return result;
    }
    
    let allCanBeEmpty = true;
    for (const symbol of symbols) {
      if (this.nonTerminals.has(symbol)) {
        this.first[symbol].forEach(s => {
          if (s !== 'ε') result.add(s);
        });
        if (!this.first[symbol].has('ε')) {
          allCanBeEmpty = false;
          break;
        }
      } else {
        result.add(symbol);
        allCanBeEmpty = false;
        break;
      }
    }
    
    if (allCanBeEmpty) {
      result.add('ε');
    }
    
    return result;
  }

  tokenize(input: string): string[] {
    return input.split(' ').filter(token => token.length > 0).concat('$');
  }

  parse(input: string): ParseResult {
    const tokens = this.tokenize(input);
    const stack: string[] = ['$', Array.from(this.nonTerminals)[0]];
    let position = 0;
    const steps: Step[] = [];

    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      const currentToken = tokens[position];

      steps.push({
        stack: [...stack],
        input: tokens.slice(position),
        action: ''
      });

      if (top === currentToken) {
        stack.pop();
        position++;
        steps[steps.length - 1].action = `Matched ${top}`;
      } else if (this.terminals.has(top)) {
        return {
          steps,
          success: false,
          error: `Mismatch: expected ${top} but got ${currentToken}`
        };
      } else {
        const production = this.parsingTable[`${top},${currentToken}`];
        if (!production) {
          return {
            steps,
            success: false,
            error: `No production found for ${top} with input ${currentToken}`
          };
        }

        stack.pop();
        const symbols = production.split(' ');
        for (let i = symbols.length - 1; i >= 0; i--) {
          if (symbols[i] !== 'ε') {
            stack.push(symbols[i]);
          }
        }
        steps[steps.length - 1].action = `${top} -> ${production}`;
      }
    }

    if (position < tokens.length) {
      return {
        steps,
        success: false,
        error: `Input not fully consumed. Remaining: ${tokens.slice(position).join(' ')}`
      };
    }

    return { steps, success: true };
  }
}