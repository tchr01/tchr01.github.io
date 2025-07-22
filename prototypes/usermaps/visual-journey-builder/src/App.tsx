import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import TouchpointLibrary from './components/touchpoints/TouchpointLibrary';
import JourneyCanvas from './components/canvas/JourneyCanvas';
import ROIPanel from './components/roi/ROIPanel';
import PersonaCard from './components/PersonaCard';
import TemplateSelector from './components/TemplateSelector';
import { JourneyStep, TouchpointType } from './types';

function App() {
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [showPersona, setShowPersona] = useState(true);

  const addTouchpointToCanvas = (touchpoint: TouchpointType, position?: { x: number; y: number }) => {
    const defaultPosition = position || { 
      x: 100 + (journeySteps.length * 150), 
      y: 200 
    };
    
    const newStep: JourneyStep = {
      id: `step-${Date.now()}`,
      touchpointId: touchpoint.id,
      position: defaultPosition,
      name: touchpoint.name,
      conversionRate: 0.1,
      value: 1000
    };
    setJourneySteps(prev => [...prev, newStep]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    
    if (over && over.id === 'canvas') {
      const touchpointData = active.data.current?.touchpoint;
      if (touchpointData) {
        // Calculate position relative to canvas
        const canvas = document.getElementById('journey-canvas');
        const rect = canvas?.getBoundingClientRect();
        const x = rect ? Math.max(50, Math.min(rect.width - 50, 200 + delta.x)) : 200;
        const y = rect ? Math.max(50, Math.min(rect.height - 50, 200 + delta.y)) : 200;
        
        addTouchpointToCanvas(touchpointData, { x, y });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visual Journey Builder</h1>
              <p className="text-sm text-gray-600">Enterprise B2B User Journey Orchestration</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPersona(!showPersona)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {showPersona ? 'Hide' : 'Show'} Persona
              </button>
              <div className="text-sm text-gray-600">
                Steps: {journeySteps.length}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Touchpoint Library */}
          <TouchpointLibrary onAddToCanvas={addTouchpointToCanvas} />

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            {showPersona && (
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-4">
                <PersonaCard />
                <TemplateSelector onLoadTemplate={setJourneySteps} />
              </div>
            )}
            <JourneyCanvas steps={journeySteps} onStepsChange={setJourneySteps} />
          </div>

          {/* ROI Panel */}
          <ROIPanel steps={journeySteps} />
        </div>
      </div>
    </DndContext>
  );
}

export default App;
