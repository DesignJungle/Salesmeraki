'use client';

import React, { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * @deprecated Use the app router layout at src/app/dashboard/layout.tsx instead
 * This component is kept for backward compatibility but will be removed in a future version
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  
  useEffect(() => {
    console.warn(
      'DashboardLayout component is deprecated. Use the app router layout at src/app/dashboard/layout.tsx instead.'
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
