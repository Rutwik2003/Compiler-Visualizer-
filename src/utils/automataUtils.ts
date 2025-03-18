/* --- Regex to Postfix Conversion --- */
export function regexToPostfix(regex: string) {
    let output = "";
    const operators = new Set(["*", "|", "(", ")"]);
    for (let i = 0; i < regex.length; i++) {
        let c1 = regex[i];
        output += c1;
        if (i + 1 < regex.length) {
            let c2 = regex[i + 1];
            if ((!operators.has(c1) || c1 === "*" || c1 === ")") &&
                (!operators.has(c2) || c2 === "(")) {
                output += ".";
            }
        }
    }
    const prec = { "*": 3, ".": 2, "|": 1 };
    let stack = [];
    let postfix = "";
    for (let c of output) {
        if (c === "(") {
            stack.push(c);
        } else if (c === ")") {
            while (stack.length && stack[stack.length - 1] !== "(")
                postfix += stack.pop();
            stack.pop();
        } else if (prec[c as keyof typeof prec]) {
            while (stack.length && prec[stack[stack.length - 1] as keyof typeof prec] >= prec[c as keyof typeof prec])
                postfix += stack.pop();
            stack.push(c);
        } else {
            postfix += c;
        }
    }
    while (stack.length) {
        postfix += stack.pop();
    }
    return postfix;
}

/* --- Thompson's Construction --- */
let stateId = 0;

interface State {
    id: number;
    transitions: {
        [key: string]: State[];
    };
}

export function newState(): State {
    return { id: stateId++, transitions: {} };
}

export function addTransition(state: State, symbol: string, nextState: State) {
    if (!state.transitions[symbol]) state.transitions[symbol] = [];
    state.transitions[symbol].push(nextState);
}

export function thompsonConstruction(postfix: string) {
    let stack: Array<{ start: State; accept: State }> = [];
    let steps = [`Postfix: ${postfix}`];
    
    for (let c of postfix) {
        if (c === '*') {
            let frag = stack.pop()!;
            let start = newState();
            let accept = newState();
            addTransition(start, 'ε', frag.start);
            addTransition(start, 'ε', accept);
            addTransition(frag.accept, 'ε', frag.start);
            addTransition(frag.accept, 'ε', accept);
            steps.push(`Kleene Star: ${start.id} -> ${accept.id}`);
            stack.push({ start: start, accept: accept });
        } else if (c === '.') {
            let frag2 = stack.pop()!;
            let frag1 = stack.pop()!;
            addTransition(frag1.accept, 'ε', frag2.start);
            steps.push(`Concatenation: ${frag1.accept.id} -> ${frag2.start.id}`);
            stack.push({ start: frag1.start, accept: frag2.accept });
        } else if (c === '|') {
            let frag2 = stack.pop()!;
            let frag1 = stack.pop()!;
            let start = newState();
            let accept = newState();
            addTransition(start, 'ε', frag1.start);
            addTransition(start, 'ε', frag2.start);
            addTransition(frag1.accept, 'ε', accept);
            addTransition(frag2.accept, 'ε', accept);
            steps.push(`Union: ${start.id} -> ${accept.id}`);
            stack.push({ start: start, accept: accept });
        } else {
            let start = newState();
            let accept = newState();
            addTransition(start, c, accept);
            steps.push(`Symbol ${c}: ${start.id} -> ${accept.id}`);
            stack.push({ start: start, accept: accept });
        }
    }
    return { nfa: stack.pop()!, steps };
}

/* --- Epsilon Closure & Subset Construction (NFA → DFA) --- */
export function epsilonClosure(states: State[]) {
    let stack = [...states];
    let closure = new Set(states);
    while (stack.length) {
        let state = stack.pop()!;
        if (state.transitions['ε']) {
            for (let next of state.transitions['ε']) {
                if (!closure.has(next)) {
                    closure.add(next);
                    stack.push(next);
                }
            }
        }
    }
    return closure;
}

export function move(states: Set<State>, symbol: string) {
    let result = new Set<State>();
    for (let state of states) {
        if (state.transitions[symbol]) {
            for (let next of state.transitions[symbol])
                result.add(next);
        }
    }
    return result;
}

export function nfaToDfa(nfa: { start: State; accept: State }) {
    let dfaStates: Set<State>[] = [];
    let dfaTransitions: { [key: number]: { [key: string]: number } } = {};
    let stateMap = new Map<string, number>();
    let steps: string[] = [];
    
    let startClosure = epsilonClosure([nfa.start]);
    let startKey = [...startClosure].map(s => s.id).sort((a, b) => a - b).join(",");
    stateMap.set(startKey, 0);
    dfaStates.push(startClosure);
    let unmarked = [startClosure];
    steps.push(`Start state: {${startKey}} -> S0`);
    
    while (unmarked.length) {
        let current = unmarked.pop()!;
        let currentKey = [...current].map(s => s.id).sort((a, b) => a - b).join(",");
        let dfaStateId = stateMap.get(currentKey)!;
        let symbols = new Set<string>();
        
        for (let state of current) {
            for (let sym in state.transitions) {
                if (sym !== 'ε') symbols.add(sym);
            }
        }
        
        for (let sym of symbols) {
            let target = epsilonClosure([...move(current, sym)]);
            let targetKey = [...target].map(s => s.id).sort((a, b) => a - b).join(",");
            
            if (!stateMap.has(targetKey)) {
                stateMap.set(targetKey, dfaStates.length);
                dfaStates.push(target);
                unmarked.push(target);
            }
            
            if (!dfaTransitions[dfaStateId]) dfaTransitions[dfaStateId] = {};
            dfaTransitions[dfaStateId][sym] = stateMap.get(targetKey)!;
            steps.push(`S${dfaStateId} --${sym}--> S${stateMap.get(targetKey)} (from {${targetKey}})`);
        }
    }
    
    let acceptStates = dfaStates.map((state, i) => state.has(nfa.accept) ? i : -1).filter(i => i !== -1);
    return {
        dfa: {
            states: dfaStates.map((_, i) => `S${i}`),
            transitions: dfaTransitions,
            start: 'S0',
            accept: acceptStates
        },
        steps
    };
}

/* --- Syntax Tree Method --- */
interface TreeNode {
    type: 'star' | 'concat' | 'union' | 'leaf';
    symbol: string;
    left?: TreeNode;
    right?: TreeNode;
    pos?: number;
    nullable?: boolean;
    firstpos?: Set<number>;
    lastpos?: Set<number>;
    id: string;
}

export function syntaxTreeDfa(regex: string) {
    regex = "(" + regex + ")#";
    let postfix = regexToPostfix(regex);
    let steps = [`Postfix with end marker: ${postfix}`];
    let treeStack: TreeNode[] = [];
    let posList: number[] = [];
    let posSymbol: { [key: number]: string } = {};
    let position = 1;
    let treeNodes: TreeNode[] = [];
    
    for (let c of postfix) {
        if (c === '*' || c === '.' || c === '|') {
            if (c === '*') {
                let node = treeStack.pop()!;
                let newNode: TreeNode = {
                    type: 'star',
                    symbol: c,
                    left: node,
                    id: `T${treeNodes.length}`
                };
                treeStack.push(newNode);
                treeNodes.push(newNode);
                steps.push(`Kleene Star on ${node.symbol}`);
            } else {
                let right = treeStack.pop()!;
                let left = treeStack.pop()!;
                let newNode: TreeNode = {
                    type: (c === '.') ? 'concat' : 'union',
                    symbol: c,
                    left: left,
                    right: right,
                    id: `T${treeNodes.length}`
                };
                treeStack.push(newNode);
                treeNodes.push(newNode);
                steps.push(`${c === '.' ? 'Concatenation' : 'Union'} of ${left.symbol} and ${right.symbol}`);
            }
        } else {
            let node: TreeNode = {
                type: 'leaf',
                symbol: c,
                pos: position,
                id: `T${treeNodes.length}`
            };
            node.nullable = (c === 'ε');
            node.firstpos = new Set(c === 'ε' ? [] : [position]);
            node.lastpos = new Set(c === 'ε' ? [] : [position]);
            treeStack.push(node);
            treeNodes.push(node);
            if (c !== 'ε') {
                posList.push(position);
                posSymbol[position] = c;
            }
            steps.push(`Leaf ${c} at position ${position}`);
            position++;
        }
    }
    
    let syntaxTree = treeStack.pop()!;
    
    function computeProperties(node: TreeNode) {
        if (node.type === 'leaf') return;
        if (node.type === 'union') {
            computeProperties(node.left!);
            computeProperties(node.right!);
            node.nullable = node.left!.nullable || node.right!.nullable;
            node.firstpos = new Set([...node.left!.firstpos!, ...node.right!.firstpos!]);
            node.lastpos = new Set([...node.left!.lastpos!, ...node.right!.lastpos!]);
        } else if (node.type === 'concat') {
            computeProperties(node.left!);
            computeProperties(node.right!);
            node.nullable = node.left!.nullable && node.right!.nullable;
            node.firstpos = new Set(node.left!.firstpos!);
            if (node.left!.nullable) node.firstpos = new Set([...node.firstpos, ...node.right!.firstpos!]);
            node.lastpos = new Set(node.right!.lastpos!);
            if (node.right!.nullable) node.lastpos = new Set([...node.lastpos, ...node.left!.lastpos!]);
        } else if (node.type === 'star') {
            computeProperties(node.left!);
            node.nullable = true;
            node.firstpos = new Set(node.left!.firstpos!);
            node.lastpos = new Set(node.left!.lastpos!);
        }
    }
    
    computeProperties(syntaxTree);
    steps.push(`Computed properties: nullable=${syntaxTree.nullable}, firstpos={${[...syntaxTree.firstpos!]}}, lastpos={${[...syntaxTree.lastpos!]}}`);
    
    let followpos: { [key: number]: Set<number> } = {};
    for (let pos of posList) followpos[pos] = new Set();
    
    function computeFollow(node: TreeNode) {
        if (node.type === 'concat') {
            for (let i of node.left!.lastpos!) {
                for (let j of node.right!.firstpos!)
                    followpos[i].add(j);
            }
        }
        if (node.type === 'star') {
            for (let i of node.lastpos!) {
                for (let j of node.firstpos!)
                    followpos[i].add(j);
            }
        }
        if (node.left) computeFollow(node.left);
        if (node.right) computeFollow(node.right);
    }
    
    computeFollow(syntaxTree);
    
    for (let pos in followpos) {
        if (followpos[pos].size) steps.push(`Followpos(${pos}): {${[...followpos[pos]]}}`);
    }
    
    let dfaStates: Set<number>[] = [];
    let dfaTransitions: { [key: number]: { [key: string]: number } } = {};
    let stateMap = new Map<string, number>();
    
    function setToString(s: Set<number>) {
        return [...s].sort((a, b) => a - b).join(",");
    }
    
    let startState = syntaxTree.firstpos!;
    let startKey = setToString(startState);
    stateMap.set(startKey, 0);
    dfaStates.push(startState);
    let unmarked = [startState];
    steps.push(`Start state: {${startKey}} -> S0`);
    
    while (unmarked.length) {
        let current = unmarked.pop()!;
        let currentKey = setToString(current);
        let currentId = stateMap.get(currentKey)!;
        let symbolMap: { [key: string]: Set<number> } = {};
        
        for (let pos of current) {
            let sym = posSymbol[pos];
            if (sym === '#') continue;
            if (!symbolMap[sym]) symbolMap[sym] = new Set();
            for (let f of followpos[pos]) symbolMap[sym].add(f);
        }
        
        for (let sym in symbolMap) {
            let target = symbolMap[sym];
            let targetKey = setToString(target);
            
            if (!stateMap.has(targetKey)) {
                stateMap.set(targetKey, dfaStates.length);
                dfaStates.push(target);
                unmarked.push(target);
            }
            
            if (!dfaTransitions[currentId]) dfaTransitions[currentId] = {};
            dfaTransitions[currentId][sym] = stateMap.get(targetKey)!;
            steps.push(`S${currentId} --${sym}--> S${stateMap.get(targetKey)} (from {${targetKey}})`);
        }
    }
    
    let acceptPos;
    for (let pos in posSymbol) {
        if (posSymbol[pos] === '#') {
            acceptPos = parseInt(pos);
            break;
        }
    }
    
    let acceptStates = [];
    for (let [key, id] of stateMap.entries()) {
        let stateSet = new Set(key.split(",").map(Number));
        if (stateSet.has(acceptPos)) acceptStates.push(id);
    }
    
    steps.push(`Accept states: ${acceptStates.join(", ")}`);
    return {
        dfa: {
            states: dfaStates.map((_, i) => `S${i}`),
            transitions: dfaTransitions,
            start: 'S0',
            accept: acceptStates
        },
        steps,
        treeNodes
    };
}