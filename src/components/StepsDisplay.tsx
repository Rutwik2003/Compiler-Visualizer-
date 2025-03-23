import React from 'react';

interface StepsDisplayProps {
  title: string;
  steps: string[];
}

const StepsDisplay: React.FC<StepsDisplayProps> = ({ title, steps }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
      {steps.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 italic text-center py-4">
          <p>No {title.toLowerCase()} needed.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <p key={idx} className="text-gray-700 dark:text-gray-300">{step}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepsDisplay;