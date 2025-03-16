import { useCallback, useEffect, useState } from 'react';


export const useWatchers = ({ channel }) => {
  const [watchers, setWatchers] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryWatchers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await channel.query({ watchers: { limit: 5, offset: 0 } });
      setWatchers(result?.watchers?.map((watcher) => watcher.id));
      setLoading(false);
      return;
    } catch (err) {
      console.error('An error has occurred while querying watchers: ', err);
      setError(err);
    }
  }, [channel]);

  useEffect(() => {
    queryWatchers();
  }, [queryWatchers]);

  useEffect(() => {
    const watchingStartListener = channel.on('user.watching.start', (event) => {
      const userId = event?.user?.id;
      if (userId && userId.startsWith('ai-bot')) {
        setWatchers((prevWatchers) => [
          userId,
          ...(prevWatchers || []).filter((watcherId) => watcherId !== userId),
        ]);
      }
    });

    const watchingStopListener = channel.on('user.watching.stop', (event) => {
      const userId = event?.user?.id;
      if (userId && userId.startsWith('ai-bot')) {
        setWatchers((prevWatchers) =>
          (prevWatchers || []).filter((watcherId) => watcherId !== userId)
        );
      }
    });

    return () => {
      watchingStartListener.unsubscribe();
      watchingStopListener.unsubscribe();
    };
  }, [channel]);

  return { watchers, loading, error };
};
