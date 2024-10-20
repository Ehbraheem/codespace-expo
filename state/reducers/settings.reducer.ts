import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type AuthState = {
  offlineMode: boolean;
};

const slice = createSlice({
  name: 'settings',
  initialState: {
    offlineMode: false,
  } as AuthState,
  reducers: {
    setOfflineMode: (
      state,
      {
        payload: { value },
      }: PayloadAction<{ value: AuthState['offlineMode'] }>,
    ) => {
      state.offlineMode = value;
    },
  },
});

export const { setOfflineMode } = slice.actions;

export default slice.reducer;

export const selectOfflineStatus = (state: RootState) =>
  state.settings.offlineMode;
