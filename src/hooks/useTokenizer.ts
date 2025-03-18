import { useState } from 'react';

interface Token {
  value: string;
  type: string;
  position: number;
}

export function useTokenizer() {
  const [tokens, setTokens] = useState<Token[]>([]);

  const tokenize = (input: string) => {
    const tokenRegex = /\d+|\+|\-|\*|\/|\(|\)/g;
    const newTokens: Token[] = [];
    let match;

    while ((match = tokenRegex.exec(input)) !== null) {
      const value = match[0];
      const type = getTokenType(value);
      newTokens.push({
        value,
        type,
        position: match.index + 1
      });
    }

    setTokens(newTokens);
    return newTokens;
  };

  const getTokenType = (token: string): string => {
    if (/^\d+$/.test(token)) return "NUMBER";
    if (token === "+") return "PLUS";
    if (token === "-") return "MINUS";
    if (token === "*") return "TIMES";
    if (token === "/") return "DIVIDE";
    if (token === "(") return "LPAREN";
    if (token === ")") return "RPAREN";
    return "UNKNOWN";
  };

  return { tokens, tokenize };
}