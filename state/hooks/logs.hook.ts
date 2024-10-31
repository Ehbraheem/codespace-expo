import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLogs, selectLogsToSync } from '../reducers/logs.reducer';

export const useLogs = () => {
  const logs = useSelector(selectLogs);
  const logsToSync = useSelector(selectLogsToSync);
  return useMemo(() => ({ logs, logsToSync }), [logs, logsToSync]);
};
