'use client';

import React, { ReactNode, useEffect } from 'react';

interface NewDashboardLayoutProps {
  children: ReactNode;
}

/**
 * @deprecated Use the app router layout at src/app/dashboard/layout.tsx instead
 * This component is kept for backward compatibility but will be removed in a future version
 */
const NewDashboardLayout: React.FC<NewDashboardLayoutProps> = ({ children }) => {
  useEffect(() => {
    console.warn(
      'NewDashboardLayout component is deprecated. Use the app router layout at src/app/dashboard/layout.tsx instead.'
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main>{children}</main>
    </div>
  );
};

export default NewDashboardLayout;
