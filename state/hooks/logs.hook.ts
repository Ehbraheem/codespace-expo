import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLogs } from '../reducers/logs.reducer';

export const useLogs = () => {
  const logs = useSelector(selectLogs);
  return useMemo(() => ({ logs }), [logs]);
};
