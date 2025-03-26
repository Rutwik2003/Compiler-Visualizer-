import React, { useState } from 'react';

interface GrammarFormProps {
  onSubmit: (grammar: string, inputString: string) => void;
}

const GrammarForm: React.FC<GrammarFormProps> = ({ onSubmit }) => {
  const [grammar, setGrammar] = useState(
    "E -> E + T | T\nT -> T * F | F\nF -> ( E ) | id"
  );
  const [inputString, setInputString] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(grammar, inputString);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="grammar" className="block text-sm font-medium text-gray-700">
            Enter Grammar
          </label>
          <textarea
            id="grammar"
            name="grammar"
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={grammar}
            onChange={(e) => setGrammar(e.target.value)}
            placeholder="e.g., E -> E + T | T"
          />
        </div>
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700">
            Input String
          </label>
          <input
            type="text"
            id="input"
            name="input"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Enter string to parse (space-separated tokens, e.g., id + id)"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Parse
        </button>
      </form>
    </div>
  );
};

export default GrammarForm;