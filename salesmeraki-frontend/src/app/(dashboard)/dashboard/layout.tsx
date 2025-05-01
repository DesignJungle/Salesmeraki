import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64"> {/* Add margin to prevent content overlay */}
          <TopNav />
          <main id="main-content" className="py-10 px-4 sm:px-6 lg:px-8" tabIndex={-1} aria-label="Main content">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
