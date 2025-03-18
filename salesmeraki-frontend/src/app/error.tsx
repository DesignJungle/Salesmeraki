'use client';

import ErrorHandler from '@/components/error/ErrorHandler';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorHandler error={error} reset={reset} />;
}