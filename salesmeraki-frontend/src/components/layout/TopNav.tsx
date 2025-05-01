'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  EyeIcon,
  ArrowLeftIcon,
  HomeIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { RealTimeNotifications } from '@/components/notifications/RealTimeNotifications';
import MobileNav from './MobileNav';
import HighContrastToggle from '@/components/accessibility/HighContrastToggle';
import FontSizeAdjuster from '@/components/accessibility/FontSizeAdjuster';

export default function TopNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're on the dashboard page or any dashboard-related page
  const isDashboard = pathname === '/dashboard';
  const isDashboardSection = pathname?.startsWith('/dashboard/') ||
                            pathname?.startsWith('/sales-intelligence') ||
                            pathname?.startsWith('/workflows') ||
                            pathname?.startsWith('/coaching') ||
                            pathname?.startsWith('/collaboration') ||
                            pathname?.startsWith('/analytics') ||
                            pathname?.startsWith('/customers') ||
                            pathname?.startsWith('/opportunities');

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  // Add keyboard shortcut for back navigation (Alt+Home)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Home' && !isDashboard && session) {
        handleBackToDashboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDashboard, session]);

  return (
    <nav className="bg-white shadow-sm" role="navigation" aria-label="Main header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile navigation */}
            <div className="mr-2 lg:hidden">
              <MobileNav />
            </div>

            {/* Back to Dashboard button - only show if in a dashboard section but not on dashboard */}
            {!isDashboard && isDashboardSection && session && (
              <button
                onClick={handleBackToDashboard}
                className="flex items-center mr-4 text-gray-600 hover:text-primary transition-colors group relative"
                aria-label="Back to Dashboard"
                title="Back to Dashboard (Alt+Home)"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="hidden lg:inline text-xs text-gray-400 ml-1">(Alt+Home)</span>
              </button>
            )}

            <div className="flex space-x-4">
              {/* Home button - always visible */}
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-primary transition-colors group relative"
                aria-label="Go to Homepage"
                title="Go to Homepage"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Home</span>
              </Link>

              {/* Dashboard button - only visible when not in any dashboard section */}
              {!isDashboard && !isDashboardSection && session && (
                <Link
                  href="/dashboard"
                  className="flex items-center text-gray-600 hover:text-primary transition-colors group relative"
                  aria-label="Go to Dashboard"
                  title="Go to Dashboard"
                >
                  <RocketLaunchIcon className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2">
                  <HighContrastToggle />
                  <FontSizeAdjuster />
                  <RealTimeNotifications />
                </div>
                <div className="relative">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center text-gray-700 hover:text-gray-900" aria-label="User menu" aria-haspopup="true">
                      <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                      <span className="ml-2 hidden md:block">{session.user?.name || session.user?.email}</span>
                    </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10" aria-label="User menu options">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <UserCircleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/settings"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <Cog6ToothIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/settings/accessibility"
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <EyeIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                              Accessibility
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleSignOut}
                              className={`${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-text-primary hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}