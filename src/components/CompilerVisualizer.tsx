import React, { useRef, useState } from "react";
import { Play, AlertCircle } from "lucide-react";
import { useTokenizer } from "../hooks/useTokenizer";
import { useParseTree } from "../hooks/useParseTree";

interface CompilerVisualizerProps {
  isDarkMode: boolean;
}

export function CompilerVisualizer({ isDarkMode }: CompilerVisualizerProps) {
  const [error, setError] = useState<string | null>(null);
  const expressionRef = useRef<HTMLInputElement>(null);
  const { tokens, tokenize } = useTokenizer();
  const { parseTree, generateParseTree } = useParseTree();

  const handleRunCompiler = () => {
    setError(null);
    const expr = expressionRef.current?.value.trim() || "";
    if (!expr) {
      setError("Please enter an arithmetic expression");
      return;
    }

    try {
      tokenize(expr);
      generateParseTree(expr);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div
        className={`p-4 sm:p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        <h2 className="text-xl font-semibold mb-4">Enter Expression</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            ref={expressionRef}
            type="text"
            placeholder="E.g., (3 + 4) * 5"
            className={`flex-1 px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            onClick={handleRunCompiler}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" />
            Run Parser
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tokens Table */}
        <div
          className={`p-4 sm:p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg overflow-x-auto`}
        >
          <h2 className="text-xl font-semibold mb-4">Tokens</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[300px]">
              <thead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                <tr>
                  <th className="text-left py-2 px-2">Token</th>
                  <th className="text-left py-2 px-2">Type</th>
                  <th className="text-left py-2 px-2">Position</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {tokens.map((token, index) => (
                  <tr key={index}>
                    <td className="py-2 px-2">{token.value}</td>
                    <td className="py-2 px-2">{token.type}</td>
                    <td className="py-2 px-2">{token.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Parse Tree */}
        <div
          className={`p-4 sm:p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4">Parse Tree</h2>
          <div
            id="tree"
            className={`w-full min-h-[300px] sm:min-h-[400px] max-h-[600px] rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            } overflow-auto flex justify-center items-center`}
          />
        </div>

        {/* Parsing Steps */}
        <div
          className={`p-4 sm:p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg col-span-full`}
        >
          <h2 className="text-xl font-semibold mb-4">Parsing Steps</h2>
          <div
            id="parsing-steps"
            className={`space-y-2 max-h-[300px] overflow-y-auto p-4 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-50 text-gray-600"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
