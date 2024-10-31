import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type Log = {
  logEntryId: string;
  staffId: string;
  barCodeId: string;
  longitude?: string;
  latitude?: string;
  comment: string;
  offline: string;
  syncedAt?: Date;
};

type AuthState = {
  logs: Log[];
};

const slice = createSlice({
  name: 'logs',
  initialState: {
    logs: [],
  } as AuthState,
  reducers: {
    setLogs: (
      state,
      { payload: { logs } }: PayloadAction<{ logs: AuthState['logs'] }>,
    ) => {
      state.logs = logs;
    },
    addLog: (state, { payload: { log } }: PayloadAction<{ log: Log }>) => {
      state.logs = [...state.logs, log];
    },
    markLogAsSynced: (
      state,
      { payload: { logEntryIds } }: PayloadAction<{ logEntryIds: string[] }>,
    ) => {
      let syncedLogs = state.logs.filter(log =>
        logEntryIds.includes(log.logEntryId),
      );
      syncedLogs = syncedLogs.map(log => ({ ...log, syncedAt: new Date() }));

      const logs = new Set([...state.logs, ...syncedLogs]);
      state.logs = Array.from(logs);
    },
  },
});

export const { setLogs, addLog, markLogAsSynced } = slice.actions;

export default slice.reducer;

export const selectLogs = (state: RootState) => state.logs.logs;

export const selectLogsToSync = createSelector([selectLogs], logs =>
  logs.filter(log => !log.syncedAt),
);
