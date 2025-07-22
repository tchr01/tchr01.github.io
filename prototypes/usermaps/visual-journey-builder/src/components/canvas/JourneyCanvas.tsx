import React, { useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { JourneyStep } from '../../types';
import JourneyStepComponent from './JourneyStep';

interface JourneyCanvasProps {
  steps: JourneyStep[];
  onStepsChange: (steps: JourneyStep[]) => void;
}

const JourneyCanvas: React.FC<JourneyCanvasProps> = ({ steps, onStepsChange }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const updateStepPosition = useCallback((stepId: string, position: { x: number; y: number }) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, position } : step
    );
    onStepsChange(updatedSteps);
  }, [steps, onStepsChange]);

  const removeStep = useCallback((stepId: string) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    onStepsChange(updatedSteps);
  }, [steps, onStepsChange]);

  return (
    <div className="flex-1 relative bg-white">
      <div
        id="journey-canvas"
        ref={setNodeRef}
        className={`
          w-full h-full min-h-screen relative
          ${isOver ? 'bg-blue-50' : 'bg-white'}
          transition-colors duration-200
        `}
      >
        {steps.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <div className="text-xl font-medium">Build your customer journey</div>
              <div className="text-sm mt-2 max-w-md">
                <p className="mb-2">• Drag touchpoints from the library to this canvas</p>
                <p className="mb-2">• Double-click touchpoints to add them quickly</p>
                <p className="mb-2">• Try the "Load Sample Journey" button above</p>
                <p>• Click on placed touchpoints to see details</p>
              </div>
            </div>
          </div>
        )}
        
        {steps.map(step => (
          <JourneyStepComponent
            key={step.id}
            step={step}
            onPositionChange={updateStepPosition}
            onRemove={removeStep}
          />
        ))}
        
        {isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default JourneyCanvas;