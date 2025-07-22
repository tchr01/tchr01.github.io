import React, { useState } from 'react';
import { JourneyStep } from '../../types';

interface JourneyStepProps {
  step: JourneyStep;
  onPositionChange: (stepId: string, position: { x: number; y: number }) => void;
  onRemove: (stepId: string) => void;
}

const touchpointIcons: { [key: string]: string } = {
  'email': '📧',
  'website': '🌐',
  'mobile-app': '📱',
  'social-media': '📱',
  'webinar': '🎥',
  'demo': '🎯',
  'sales-call': '📞',
  'trade-show': '🏢',
  'whitepaper': '📄',
  'free-trial': '🚀'
};

const touchpointColors: { [key: string]: string } = {
  'email': 'bg-blue-500',
  'website': 'bg-green-500',
  'mobile-app': 'bg-purple-500',
  'social-media': 'bg-pink-500',
  'webinar': 'bg-indigo-500',
  'demo': 'bg-orange-500',
  'sales-call': 'bg-red-500',
  'trade-show': 'bg-yellow-500',
  'whitepaper': 'bg-gray-500',
  'free-trial': 'bg-cyan-500'
};

const JourneyStepComponent: React.FC<JourneyStepProps> = ({ step, onPositionChange, onRemove }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isDragging = false;

  const icon = touchpointIcons[step.touchpointId] || '❓';
  const color = touchpointColors[step.touchpointId] || 'bg-gray-500';

  return (
    <div
      style={{
        position: 'absolute',
        left: step.position.x - 40,
        top: step.position.y - 40,
      }}
      className="z-10"
    >
      <div
        className={`
          relative cursor-move
          ${isDragging ? 'opacity-50' : 'opacity-100'}
        `}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className={`
          w-20 h-20 rounded-full ${color} text-white
          flex items-center justify-center text-2xl
          shadow-lg hover:shadow-xl transition-all duration-200
          border-4 border-white
        `}>
          {icon}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(step.id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
        >
          ×
        </button>
        
        <div className="text-center mt-2 text-sm font-medium text-gray-700 max-w-20 truncate">
          {step.name}
        </div>
      </div>

      {showDetails && (
        <div className="absolute top-24 left-0 bg-white p-4 rounded-lg shadow-lg border z-20 w-64">
          <h4 className="font-semibold mb-2">{step.name}</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Conversion Rate: {(step.conversionRate! * 100).toFixed(1)}%</div>
            <div>Value per Conversion: ${step.value?.toLocaleString()}</div>
            <div>Expected Revenue: ${((step.conversionRate! * step.value!) || 0).toLocaleString()}</div>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default JourneyStepComponent;