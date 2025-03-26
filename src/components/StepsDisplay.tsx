import React from 'react';

interface StepsDisplayProps {
  title: string;
  steps: string[];
  isDarkMode: boolean; // Add isDarkMode here
}

const StepsDisplay: React.FC<StepsDisplayProps> = ({ title, steps, isDarkMode }) => {
  return (
    <div className={`p-6 rounded-lg shadow-md mt-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{title}</h2>
      {steps.length === 0 ? (
        <div className={`text-${isDarkMode ? 'gray-400' : 'gray-500'} italic text-center py-4`}>
          <p>No {title.toLowerCase()} needed.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <p key={idx} className={`text-${isDarkMode ? 'gray-300' : 'gray-700'}`}>{step}</p>
          ))}
        </div>
      )}
    </div>
  );
};



export default StepsDisplay;