import React from 'react';
import { JourneyStep } from '../types';

interface TemplateSelectorProps {
  onLoadTemplate: (steps: JourneyStep[]) => void;
}

const sampleTemplate: JourneyStep[] = [
  {
    id: 'step-1',
    touchpointId: 'website',
    position: { x: 100, y: 100 },
    name: 'Website Visit',
    conversionRate: 0.15,
    value: 500
  },
  {
    id: 'step-2',
    touchpointId: 'whitepaper',
    position: { x: 300, y: 100 },
    name: 'Whitepaper Download',
    conversionRate: 0.25,
    value: 1200
  },
  {
    id: 'step-3',
    touchpointId: 'webinar',
    position: { x: 500, y: 100 },
    name: 'Product Webinar',
    conversionRate: 0.40,
    value: 2500
  },
  {
    id: 'step-4',
    touchpointId: 'demo',
    position: { x: 700, y: 100 },
    name: 'Product Demo',
    conversionRate: 0.60,
    value: 5000
  },
  {
    id: 'step-5',
    touchpointId: 'sales-call',
    position: { x: 900, y: 100 },
    name: 'Sales Call',
    conversionRate: 0.80,
    value: 15000
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onLoadTemplate }) => {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-blue-800">Sample Template</h3>
      <p className="text-sm text-blue-600 mb-3">
        Software Evaluation Journey - From awareness to purchase
      </p>
      <button
        onClick={() => onLoadTemplate(sampleTemplate)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
      >
        Load Sample Journey
      </button>
    </div>
  );
};

export default TemplateSelector;