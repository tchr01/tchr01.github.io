import React from 'react';
import { Persona } from '../types';

const samplePersona: Persona = {
  id: 'enterprise-buyer',
  name: 'Sarah Chen',
  role: 'VP of Operations',
  company: 'TechCorp Enterprise',
  painPoints: [
    'Managing multiple vendor relationships',
    'Ensuring security compliance',
    'Proving ROI to executive team',
    'Integration complexity'
  ],
  goals: [
    'Streamline operations',
    'Reduce vendor costs by 20%',
    'Improve team productivity',
    'Maintain security standards'
  ],
  preferredChannels: [
    'Email',
    'LinkedIn',
    'Industry webinars',
    'Peer recommendations'
  ]
};

const PersonaCard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-md">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {samplePersona.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">{samplePersona.name}</h3>
          <p className="text-sm text-gray-600">{samplePersona.role}</p>
          <p className="text-xs text-gray-500">{samplePersona.company}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Pain Points</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {samplePersona.painPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Goals</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {samplePersona.goals.map((goal, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Preferred Channels</h4>
          <div className="flex flex-wrap gap-1">
            {samplePersona.preferredChannels.map((channel, index) => (
              <span 
                key={index} 
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaCard;