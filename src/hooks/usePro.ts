'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface ProState {
  isSignedIn: boolean;
  isPro: boolean;
  isLoading: boolean;
}

export function usePro(): ProState {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!isLoaded) return;

    if (!isSignedIn || !userId) {
      setIsPro(false);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    fetch('/api/billing/subscription')
      .then((res) => {
        if (!res.ok) throw new Error('not ok');
        return res.json();
      })
      .then((data: { isPro: boolean }) => {
        if (!cancelled) {
          setIsPro(data.isPro ?? false);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsPro(false);
          setIsLoading(false);
        }
      });
    /* eslint-enable react-hooks/set-state-in-effect */

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId]);

  return { isSignedIn: isSignedIn ?? false, isPro, isLoading };
}
