'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';

const onboardingSteps = [
  {
    title: 'Connect Your CRM',
    description: 'Connect your existing CRM to import your sales data',
    options: ['Salesforce', 'HubSpot', 'Pipedrive', 'Other']
  },
  {
    title: 'Set Up Your Team',
    description: 'Invite team members and set their roles',
    component: 'TeamSetup',
    options: [] as string[] // Add empty options array
  },
  {
    title: 'Configure AI Settings',
    description: 'Customize AI features for your sales process',
    component: 'AISettings',
    options: [] as string[] // Add empty options array
  }
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<Record<number, boolean>>({});

  const handleStepComplete = (step: number) => {
    setProgress(prev => ({ ...prev, [step]: true }));
    if (step < onboardingSteps.length - 1) {
      setCurrentStep(step + 1);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative">
          <div className="absolute left-0 w-full h-1 bg-gray-200 rounded">
            <div
              className="absolute h-full bg-primary rounded transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {onboardingSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                } transition-colors duration-500`}
              >
                {progress[index] ? (
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white">{index + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {onboardingSteps[currentStep].title}
          </h2>
          <p className="text-gray-600 mb-8">
            {onboardingSteps[currentStep].description}
          </p>

          {/* Step content */}
          {currentStep === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {onboardingSteps[0].options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleStepComplete(0)}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span>{option}</span>
                  <ArrowRightIcon className="w-5 h-5 text-primary" />
                </button>
              ))}
            </div>
          )}

          {/* Add more step-specific content here */}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => handleStepComplete(currentStep)}
              className="btn-primary-enhanced"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Complete Setup' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}