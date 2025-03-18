export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-2xl font-bold text-gray-900">
            <span className="gradient-text">SalesMeraki</span>
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}