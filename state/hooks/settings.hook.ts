import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectOfflineStatus } from '../reducers/settings.reducer';

export const useSettings = () => {
  const offlineStatus = useSelector(selectOfflineStatus);
  return useMemo(() => ({ offlineStatus }), [offlineStatus]);
};
