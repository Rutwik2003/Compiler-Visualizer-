export interface Step {
  stack: string[];
  input: string[];
  action: string;
}

export interface ParseResult {
  steps: Step[];
  success: boolean;
  error?: string;
}

export interface ParserSteps {
  leftRecursion: string[];
  leftFactoring: string[];
  first: { [nonTerminal: string]: Set<string> };
  follow: { [nonTerminal: string]: Set<string> };
  table: string[];
  parsing: Step[];
}