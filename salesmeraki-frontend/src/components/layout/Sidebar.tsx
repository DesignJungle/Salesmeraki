'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  CogIcon,
  DocumentChartBarIcon,
  RocketLaunchIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Sales Workflows', href: '/workflows', icon: RocketLaunchIcon },
  { name: 'AI Coaching', href: '/coaching', icon: ChatBubbleLeftIcon },
  { name: 'Team Collaboration', href: '/collaboration', icon: UserGroupIcon },
  { name: 'Analytics', href: '/analytics', icon: DocumentChartBarIcon },
  { name: 'Sales Intelligence', href: '/sales-intelligence', icon: ChartBarIcon },
  { name: 'Customers', href: '/customers', icon: UserGroupIcon },
  { name: 'Opportunities', href: '/opportunities', icon: BriefcaseIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0" aria-label="Sidebar navigation">
      <div className="flex flex-col h-full sidebar-gradient border-r border-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <Link href="/" aria-label="SalesMeraki Home" className="w-full">
              <h1 className="text-2xl font-bold text-white gradient-text text-center py-2 border-b border-gray-700">SalesMeraki</h1>
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary/20 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
