'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function SessionCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (status === 'authenticated' && session?.accessToken) {
        try {
          // Verify token is still valid
          const res = await fetch('/api/auth/verify');
          if (!res.ok) {
            console.error('Session invalid, signing out');
            await signOut({ redirect: false });
            router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
          }
        } catch (error) {
          console.error('Session check error:', error);
        }
      }
      setIsChecking(false);
    };

    if (status !== 'loading') {
      checkSession();
    }
  }, [session, status, router, pathname]);

  if (status === 'loading' || isChecking) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}