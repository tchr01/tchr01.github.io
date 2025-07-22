import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { JourneyStep } from '../../types';

interface ROIPanelProps {
  steps: JourneyStep[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const ROIPanel: React.FC<ROIPanelProps> = ({ steps }) => {
  const totalInvestment = steps.length * 5000; // Assume $5k per touchpoint
  const totalRevenue = steps.reduce((sum, step) => {
    return sum + ((step.conversionRate || 0.1) * (step.value || 1000));
  }, 0);
  const roi = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0;

  const stepData = steps.map((step, index) => ({
    name: step.name,
    revenue: (step.conversionRate || 0.1) * (step.value || 1000),
    conversion: (step.conversionRate || 0.1) * 100,
    fill: COLORS[index % COLORS.length]
  }));


  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">ROI Calculator</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Investment</h3>
          <p className="text-2xl font-bold text-gray-900">${totalInvestment.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Expected Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">ROI</h3>
          <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {roi.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Revenue by Touchpoint */}
      {steps.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Touchpoint</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stepData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Conversion Rates */}
      {steps.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Rates</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={stepData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="conversion"
                label={(entry) => `${entry.name}: ${entry.conversion.toFixed(1)}%`}
                labelLine={false}
                fontSize={10}
              >
                {stepData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conversion Rate']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Journey Metrics */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Journey Metrics</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Touchpoints:</span>
            <span className="font-medium">{steps.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg. Conversion:</span>
            <span className="font-medium">
              {steps.length > 0 
                ? (steps.reduce((sum, step) => sum + (step.conversionRate || 0.1), 0) / steps.length * 100).toFixed(1) + '%'
                : '0%'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Journey Value:</span>
            <span className="font-medium">${totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIPanel;