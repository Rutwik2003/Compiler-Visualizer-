import React, { useState } from 'react';
import { Moon, Sun, Code2, GitGraph, Menu, X } from 'lucide-react';
import { CompilerVisualizer } from './components/CompilerVisualizer';
import { AutomataConverter } from './components/AutomataConverter';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'compiler' | 'automata'>('compiler');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <header className={`border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      } shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                {/* <Code2 className="w-6 h-6" /> */}
                <img src="./komi.png" alt="Logo" className="w-6 h-6" />
                <h1 className="text-xl font-bold">Compiler Tools</h1>
              </div>
            </div>

            <div className="hidden sm:flex space-x-4">
              <button
                onClick={() => setActiveTab('compiler')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'compiler'
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Code2 className="w-4 h-4 inline-block mr-2" />
                Parser Visualizer
              </button>
              <button
                onClick={() => setActiveTab('automata')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'automata'
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <GitGraph className="w-4 h-4 inline-block mr-2" />
                Automata Converter
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-yellow-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden py-4 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('compiler');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-colors flex items-center ${
                  activeTab === 'compiler'
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Parser Visualizer
              </button>
              <button
                onClick={() => {
                  setActiveTab('automata');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-colors flex items-center ${
                  activeTab === 'automata'
                    ? isDarkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <GitGraph className="w-4 h-4 mr-2" />
                Automata Converter
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'compiler' ? (
          <CompilerVisualizer isDarkMode={isDarkMode} />
        ) : (
          <AutomataConverter isDarkMode={isDarkMode} />
        )}
      </main>
    </div>
  );
}

export default App;