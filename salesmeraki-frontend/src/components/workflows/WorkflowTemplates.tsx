'use client';

import { useState } from 'react';
import { WorkflowTemplate } from '@/types/workflows';

export default function WorkflowTemplates() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'sales', 'onboarding', 'support', 'marketing'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Workflow Templates</h2>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {templates
          .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
          .map((template) => (
            <div key={template.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">{template.name}</h3>
              <p className="text-gray-500 mb-4">{template.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    ⭐ {template.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    👥 {template.popularity}
                  </span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Use Template
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}