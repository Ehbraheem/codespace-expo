import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type AuthState = {
  logs: any[];
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
    addLog: (state, { payload: { log } }: PayloadAction<{ log: any }>) => {
      state.logs = [...state.logs, log];
    },
  },
});

export const { setLogs, addLog } = slice.actions;

export default slice.reducer;

export const selectLogs = (state: RootState) => state.logs.logs;
