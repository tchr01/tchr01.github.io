export interface TouchpointType {
  id: string;
  name: string;
  icon: string;
  category: 'digital' | 'traditional' | 'personal';
  color: string;
}

export interface JourneyStep {
  id: string;
  touchpointId: string;
  position: { x: number; y: number };
  name: string;
  description?: string;
  conversionRate?: number;
  value?: number;
}

export interface JourneyFlow {
  id: string;
  name: string;
  steps: JourneyStep[];
  connections: Connection[];
  totalValue: number;
  estimatedROI: number;
}

export interface Connection {
  id: string;
  fromStepId: string;
  toStepId: string;
  conversionRate: number;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  company: string;
  painPoints: string[];
  goals: string[];
  preferredChannels: string[];
}