import { useEffect, useRef } from 'react';

interface PollingOptions {
  enabled?: boolean;
  interval?: number;
  onError?: (error: Error) => void;
}

export const usePolling = (
  callback: () => Promise<void>,
  { enabled = true, interval = 5000, onError }: PollingOptions = {}
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    const poll = async () => {
      try {
        await callback();
      } catch (error) {
        if (onError) {
          onError(error instanceof Error ? error : new Error('Polling failed'));
        }
      } finally {
        timeoutRef.current = setTimeout(poll, interval);
      }
    };

    poll();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [callback, enabled, interval, onError]);
};