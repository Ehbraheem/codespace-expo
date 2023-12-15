import { User } from '@/utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type AuthState = {
  user: User | null;
};

const slice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: User }>,
    ) => {
      state.user = user;
    },
    updateCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: User }>,
    ) => {
      state.user = user;
    },
    signOut: state => {
      state.user = null;
    },
  },
});

export const { setCredentials, updateCredentials, signOut } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.user.user;
