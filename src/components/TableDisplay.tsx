import React from 'react';

interface TableDisplayProps {
  first: { [nonTerminal: string]: Set<string> };
  follow: { [nonTerminal: string]: Set<string> };
  parsingTable: { [key: string]: string };
  nonTerminals: string[];
  terminals: string[];
}

const TableDisplay: React.FC<TableDisplayProps> = ({
  first,
  follow,
  parsingTable,
  nonTerminals,
  terminals,
}) => {
  return (
    <div className="space-y-8 mt-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">FIRST Sets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Non-terminal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Set
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nonTerminals.map((nt) => (
                <tr key={nt}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.from(first[nt]).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">FOLLOW Sets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Non-terminal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Follow Set
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nonTerminals.map((nt) => (
                <tr key={nt}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Array.from(follow[nt]).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Parsing Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Non-terminal
                </th>
                {terminals.map((t) => (
                  <th key={t} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nonTerminals.map((nt) => (
                <tr key={nt}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nt}</td>
                  {terminals.map((t) => {
                    const entry = parsingTable[`${nt},${t}`] || '';
                    return (
                      <td
                        key={t}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          entry.split(' ').length > 1
                            ? 'bg-red-100 text-red-900'
                            : entry
                            ? 'text-gray-500'
                            : 'bg-gray-100'
                        }`}
                      >
                        {entry}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableDisplay;