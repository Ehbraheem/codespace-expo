import { Users } from '@/utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type AuthState = {
  users: Users[];
};

const slice = createSlice({
  name: 'users',
  initialState: {
    users: [],
  } as AuthState,
  reducers: {
    setUsers: (
      state,
      { payload: { users } }: PayloadAction<{ users: AuthState['users'] }>,
    ) => {
      state.users = users;
    },
  },
});

export const { setUsers } = slice.actions;

export default slice.reducer;

export const selectUsers = (state: RootState) => state.users.users;
