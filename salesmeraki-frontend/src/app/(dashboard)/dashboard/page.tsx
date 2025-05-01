'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { RevenueChart, SalesBarChart } from '@/components/dashboard/DashboardCharts';
import { SalesIntelligenceDashboard } from '@/components/dashboard/SalesIntelligence';
import Link from 'next/link';

interface DashboardStats {
  salesOverview: {
    totalSales: number;
    averageOrderValue: number;
    conversionRate: number;
    totalDeals: number;
    activeDeals: number;
    closedDeals: number;
  };
  performanceMetrics: {
    salesGrowth: number;
    customerRetention: number;
    leadConversion: number;
    avgResponseTime: number;
  };
  revenueData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[];
  };
  salesByCategory: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
    }[];
  };
  upcomingTasks: {
    id: string;
    title: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  recentActivities: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }[];
}

export default function Dashboard() {
  const { formatAmount } = useCurrency();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router, timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/stats?timeRange=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data if API fails
      setDashboardData(getMockDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const getMockDashboardData = (): DashboardStats => {
    return {
      salesOverview: {
        totalSales: 125000,
        averageOrderValue: 1250,
        conversionRate: 3.2,
        totalDeals: 145,
        activeDeals: 67,
        closedDeals: 78
      },
      performanceMetrics: {
        salesGrowth: 12.5,
        customerRetention: 85,
        leadConversion: 24,
        avgResponseTime: 3.5
      },
      revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 22000, 18000, 24000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          },
          {
            label: 'Target',
            data: [15000, 15000, 18000, 18000, 21000, 21000],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
          }
        ]
      },
      salesByCategory: {
        labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
        datasets: [
          {
            label: 'Sales by Category',
            data: [45000, 35000, 30000, 15000],
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)'
            ]
          }
        ]
      },
      upcomingTasks: [
        { id: '1', title: 'Follow up with Enterprise client', dueDate: '2025-03-25', priority: 'high' },
        { id: '2', title: 'Prepare quarterly review', dueDate: '2025-03-28', priority: 'medium' },
        { id: '3', title: 'Update sales forecast', dueDate: '2025-03-30', priority: 'medium' },
        { id: '4', title: 'Client onboarding call', dueDate: '2025-03-26', priority: 'high' }
      ],
      recentActivities: [
        { id: '1', type: 'deal_closed', description: 'Closed deal with TechCorp for $25,000', timestamp: '2025-03-18T14:30:00Z' },
        { id: '2', type: 'new_lead', description: 'New lead from website: InnovateSoft', timestamp: '2025-03-18T10:15:00Z' },
        { id: '3', type: 'meeting', description: 'Meeting scheduled with GlobalTech', timestamp: '2025-03-17T16:45:00Z' },
        { id: '4', type: 'email', description: 'Sent proposal to NextGen Solutions', timestamp: '2025-03-17T09:20:00Z' }
      ]
    };
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Use the currency context's formatAmount function with isUSD=true for proper conversion
  const formatCurrency = (value: number) => {
    return formatAmount(value, true); // Explicitly set isUSD=true to ensure conversion
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deal_closed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'new_lead': return <UserGroupIcon className="h-5 w-5 text-blue-500" />;
      case 'meeting': return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case 'email': return <BoltIcon className="h-5 w-5 text-yellow-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background-light">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-dark transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Sales</h2>
            <CurrencyDollarIcon className="h-8 w-8 text-primary p-1.5 bg-primary/10 rounded-full" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData?.salesOverview.totalSales || 0)}</p>
          <div className="flex items-center mt-2">
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">{dashboardData?.performanceMetrics.salesGrowth || 0}% increase</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary-purple">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Avg. Deal Size</h2>
            <ChartBarIcon className="h-8 w-8 text-secondary-purple p-1.5 bg-secondary-purple/10 rounded-full" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardData?.salesOverview.averageOrderValue || 0)}</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">{dashboardData?.salesOverview.totalDeals || 0} total deals</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Conversion Rate</h2>
            <CheckCircleIcon className="h-8 w-8 text-primary-light p-1.5 bg-primary-light/10 rounded-full" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{dashboardData?.salesOverview.conversionRate || 0}%</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">{dashboardData?.performanceMetrics.leadConversion || 0}% from leads</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-secondary-pink">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Active Deals</h2>
            <UserGroupIcon className="h-8 w-8 text-secondary-pink p-1.5 bg-secondary-pink/10 rounded-full" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{dashboardData?.salesOverview.activeDeals || 0}</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">{dashboardData?.salesOverview.closedDeals || 0} closed this period</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border-t-4 border-gradient-start">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Revenue Trend</h2>
          <div className="h-[300px] w-full relative"> {/* Fixed height container with relative positioning */}
            {dashboardData?.revenueData && (
              <RevenueChart data={dashboardData.revenueData} />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-gradient-mid">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Sales by Category</h2>
          <div className="h-[300px] w-full relative"> {/* Fixed height container with relative positioning */}
            {dashboardData?.salesByCategory && (
              <SalesBarChart data={dashboardData.salesByCategory} />
            )}
          </div>
        </div>
      </div>

      {/* Tasks and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-gradient-end">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Tasks</h2>
            <Link href="/tasks" className="text-primary text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {dashboardData?.upcomingTasks.map(task => (
              <div key={task.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <div className="flex items-center mt-1">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">Due: {formatDate(task.dueDate)}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary-dark">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
            <Link href="/activities" className="text-primary text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {dashboardData?.recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="mr-3 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Intelligence Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Sales Intelligence</h2>
          <Link href="/sales-intelligence" className="text-primary hover:underline font-medium">View detailed analysis</Link>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-b-4 border-gradient-mid">
          <SalesIntelligenceDashboard />
        </div>
      </div>
    </div>
  );
}
