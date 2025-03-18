'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CoachingSession from '@/components/coaching/CoachingSession';
import PerformanceMetrics from '@/components/coaching/PerformanceMetrics';
import { CoachingMetrics } from '@/types/coaching';

export default function CoachingPage() {
  const [metrics, setMetrics] = useState<CoachingMetrics | null>(null);

  useEffect(() => {
    // Fetch coaching metrics
    const fetchMetrics = async () => {
      const response = await fetch('/api/coaching/metrics');
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">AI Sales Coaching</h1>
        <p className="mt-2 text-sm text-gray-600">
          Get personalized coaching and feedback to improve your sales performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CoachingSession />
        </div>
        <div className="lg:col-span-1">
          <PerformanceMetrics metrics={metrics} />
        </div>
      </div>
    </DashboardLayout>
  );
}