import React from 'react';

export const ControlToggle = ({ isDragMode, onToggle }) => {
  return (
    <div className="flex gap-2 mb-3 p-3 bg-gray-700 rounded-lg">
      <button
        onClick={() => onToggle('drag')}
        className={`flex-1 py-2 rounded transition-all ${
          isDragMode
            ? 'bg-blue-600 text-white'
            : 'bg-gray-600 text-gray-300'
        }`}
      >
        📱 Drag Mode
      </button>
      <button
        onClick={() => onToggle('orbit')}
        className={`flex-1 py-2 rounded transition-all ${
          !isDragMode
            ? 'bg-blue-600 text-white'
            : 'bg-gray-600 text-gray-300'
        }`}
      >
        🎯 Orbit Mode
      </button>
    </div>
  );
};