import React, { useState } from 'react';

interface GrammarFormProps {
  onSubmit: (grammar: string, inputString: string) => void;
  isDarkMode: boolean;
}

const GrammarForm: React.FC<GrammarFormProps> = ({ onSubmit, isDarkMode }) => {
  const [grammar, setGrammar] = useState(
    "E -> E + T | T\nT -> T * F | F\nF -> ( E ) | id"
  );
  const [inputString, setInputString] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(grammar, inputString);
  };

  return (
    <div className={`p-8 rounded-lg shadow-md ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="grammar" className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Enter Grammar
          </label>
          <textarea
            id="grammar"
            name="grammar"
            rows={5}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:border-indigo-500 focus:ring-indigo-500`}
            value={grammar}
            onChange={(e) => setGrammar(e.target.value)}
            placeholder="e.g., E -> E + T | T"
          />
        </div>
        <div>
          <label htmlFor="input" className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Input String
          </label>
          <input
            type="text"
            id="input"
            name="input"
            className={`mt-1 block w-full rounded-md shadow-sm ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:border-indigo-500 focus:ring-indigo-500`}
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Enter string to parse (space-separated tokens, e.g., id + id)"
          />
        </div>
        <button
          type="submit"
          className={`inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm ${
            isDarkMode 
              ? 'bg-indigo-500 hover:bg-indigo-600' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          Parse
        </button>
      </form>
    </div>
  );
};

export default GrammarForm;