import React, { useRef, useState } from 'react';
import { Play, Info } from 'lucide-react';
import { useAutomata } from '../hooks/useAutomata';

interface AutomataConverterProps {
  isDarkMode: boolean;
}

export function AutomataConverter({ isDarkMode }: AutomataConverterProps) {
  const [method, setMethod] = useState<'thompson' | 'syntaxTree'>('thompson');
  const regexRef = useRef<HTMLInputElement>(null);
  const { convertToAutomata } = useAutomata();

  const handleConvert = () => {
    const regex = regexRef.current?.value.trim() || '';
    if (!regex) {
      alert('Please enter a regular expression.');
      return;
    }
    convertToAutomata(regex, method, isDarkMode);
  };

  return (
    <div className="space-y-6">
      <div className={`p-4 sm:p-6 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Regular Expression to Automata Converter</h2>
          
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="regex"
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Regular Expression
                </label>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                  <Info className="w-3 h-3" />
                  <span>Supported operators: |, *, (, )</span>
                </div>
              </div>
              <div className="relative">
                <input
                  ref={regexRef}
                  type="text"
                  id="regex"
                  className={`block w-full px-4 py-3 rounded-lg text-base ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
                  placeholder="Enter a regular expression (e.g., (a|b)*abb)"
                />
              </div>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Example expressions: (a|b)*, ab*a, (a|b)*abb
              </p>
            </div>

            <div>
              <label
                htmlFor="method"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Conversion Method
              </label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value as 'thompson' | 'syntaxTree')}
                className={`block w-full px-4 py-3 rounded-lg text-base ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200`}
              >
                <option value="thompson">Thompson's Construction</option>
                <option value="syntaxTree">Syntax Tree Method</option>
              </select>
            </div>

            <div className="flex justify-center sm:justify-start">
              <button
                onClick={handleConvert}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                Convert
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8 space-y-8">
          <div>
            <h3 className={`text-xl font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            } mb-4`}>
              {method === 'thompson' ? 'NFA (Nondeterministic Finite Automaton)' : 'Syntax Tree'}
            </h3>
            <div
  id="nfa-graph"
  className={`rounded-lg p-4 h-[300px] sm:h-[400px] overflow-x-auto overflow-y-hidden ${
    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
  } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
>
  <div className="w-full h-full" />
</div>

          </div>

          <div>
            <h3 className={`text-xl font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            } mb-4`}>
              DFA (Deterministic Finite Automaton)
            </h3>
            <div
              id="dfa-graph"
              className={`rounded-lg p-4 h-[300px] sm:h-[400px] overflow-x-auto overflow-y-hidden ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="w-full h-full min-w-[800px]" />
            </div>
          </div>

          <div>
            <h3 className={`text-xl font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            } mb-4`}>
              Conversion Steps
            </h3>
            <div
              id="steps"
              className={`rounded-lg p-6 font-mono text-sm overflow-y-auto h-[300px] ${
                isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-600'
              } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}