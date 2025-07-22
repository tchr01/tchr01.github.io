import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TouchpointType } from '../../types';

const touchpoints: TouchpointType[] = [
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    category: 'digital',
    color: 'bg-blue-500'
  },
  {
    id: 'website',
    name: 'Website',
    icon: '🌐',
    category: 'digital',
    color: 'bg-green-500'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    icon: '📱',
    category: 'digital',
    color: 'bg-purple-500'
  },
  {
    id: 'social-media',
    name: 'Social Media',
    icon: '📱',
    category: 'digital',
    color: 'bg-pink-500'
  },
  {
    id: 'webinar',
    name: 'Webinar',
    icon: '🎥',
    category: 'digital',
    color: 'bg-indigo-500'
  },
  {
    id: 'demo',
    name: 'Product Demo',
    icon: '🎯',
    category: 'personal',
    color: 'bg-orange-500'
  },
  {
    id: 'sales-call',
    name: 'Sales Call',
    icon: '📞',
    category: 'personal',
    color: 'bg-red-500'
  },
  {
    id: 'trade-show',
    name: 'Trade Show',
    icon: '🏢',
    category: 'traditional',
    color: 'bg-yellow-500'
  },
  {
    id: 'whitepaper',
    name: 'Whitepaper',
    icon: '📄',
    category: 'digital',
    color: 'bg-gray-500'
  },
  {
    id: 'free-trial',
    name: 'Free Trial',
    icon: '🚀',
    category: 'digital',
    color: 'bg-cyan-500'
  }
];

interface TouchpointItemProps {
  touchpoint: TouchpointType;
  onAddToCanvas?: (touchpoint: TouchpointType) => void;
}

const TouchpointItem: React.FC<TouchpointItemProps> = ({ touchpoint, onAddToCanvas }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: touchpoint.id,
    data: {
      touchpoint,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleDoubleClick = () => {
    if (onAddToCanvas) {
      onAddToCanvas(touchpoint);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
      className={`
        p-3 m-2 rounded-lg cursor-move transition-all duration-200
        ${touchpoint.color} text-white text-center text-sm font-medium
        hover:scale-105 hover:shadow-lg
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        select-none
      `}
      title="Drag to canvas or double-click to add"
    >
      <div className="text-2xl mb-1">{touchpoint.icon}</div>
      <div>{touchpoint.name}</div>
    </div>
  );
};

interface TouchpointLibraryProps {
  onAddToCanvas?: (touchpoint: TouchpointType) => void;
}

const TouchpointLibrary: React.FC<TouchpointLibraryProps> = ({ onAddToCanvas }) => {
  const digitalTouchpoints = touchpoints.filter(t => t.category === 'digital');
  const personalTouchpoints = touchpoints.filter(t => t.category === 'personal');
  const traditionalTouchpoints = touchpoints.filter(t => t.category === 'traditional');

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Touchpoint Library</h2>
      <p className="text-xs text-gray-600 mb-4 p-2 bg-blue-50 rounded border border-blue-200">
        💡 Drag touchpoints to the canvas or double-click to add them
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Digital Channels</h3>
        <div className="grid grid-cols-2 gap-2">
          {digitalTouchpoints.map(touchpoint => (
            <TouchpointItem key={touchpoint.id} touchpoint={touchpoint} onAddToCanvas={onAddToCanvas} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Personal Interactions</h3>
        <div className="grid grid-cols-2 gap-2">
          {personalTouchpoints.map(touchpoint => (
            <TouchpointItem key={touchpoint.id} touchpoint={touchpoint} onAddToCanvas={onAddToCanvas} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Traditional</h3>
        <div className="grid grid-cols-2 gap-2">
          {traditionalTouchpoints.map(touchpoint => (
            <TouchpointItem key={touchpoint.id} touchpoint={touchpoint} onAddToCanvas={onAddToCanvas} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouchpointLibrary;