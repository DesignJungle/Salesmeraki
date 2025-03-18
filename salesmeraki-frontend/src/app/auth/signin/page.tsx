'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo(null);

    try {
      console.log('Signing in with credentials...', { email });
      
      // Try NextAuth sign in directly
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl
      });

      console.log('NextAuth sign-in result:', JSON.stringify(result));

      if (result?.error) {
        console.error('Sign-in error from NextAuth:', result.error);
        setError(result.error);
        // Add more detailed error info
        setDebugInfo(`Error: ${result.error}. Please check the console for more details.`);
      } else if (result?.ok) {
        console.log('Sign-in successful, redirecting to:', callbackUrl);
        // Success - redirect to callback URL
        router.push(callbackUrl);
      } else {
        setError('Authentication failed');
        setDebugInfo('Unknown authentication error. Please check the console.');
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError('An unexpected error occurred: ' + (error.message || 'Unknown error'));
      setDebugInfo(`Exception: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            <p className="font-bold">Debug Info:</p>
            <p>{debugInfo}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  setError('');
                  console.log('Starting Google sign-in...');
                  
                  const result = await signIn('google', { 
                    callbackUrl,
                    redirect: false 
                  });
                  
                  console.log('Google sign-in result:', result);
                  
                  if (result?.error) {
                    setError(`Google sign-in failed: ${result.error}`);
                  } else if (result?.ok) {
                    router.push(callbackUrl);
                  }
                } catch (err: any) {
                  console.error('Google sign-in error:', err);
                  setError('Failed to sign in with Google: ' + (err.message || 'Unknown error'));
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Google
            </button>
            <button
              onClick={() => signIn('linkedin', { callbackUrl })}
              className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              LinkedIn
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-dark">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}