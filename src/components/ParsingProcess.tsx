import React from 'react';
import { Step } from '../parser/types';

interface ParsingProcessProps {
  steps: Step[];
  success: boolean;
  error?: string;
}

const ParsingProcess: React.FC<ParsingProcessProps> = ({ steps, success, error }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Parsing Process</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stack
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Input
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {steps.map((step, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                  {step.stack.join(' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                  {step.input.join(' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {step.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`mt-4 p-4 rounded-md ${
        success 
          ? 'bg-green-50 dark:bg-green-900' 
          : 'bg-red-50 dark:bg-red-900'
      }`}>
        <p className={`text-sm ${
          success 
            ? 'text-green-700 dark:text-green-100' 
            : 'text-red-700 dark:text-red-100'
        }`}>
          {success ? 'Parsing completed successfully!' : `Parsing failed: ${error}`}
        </p>
      </div>
    </div>
  );
}

export default ParsingProcess;