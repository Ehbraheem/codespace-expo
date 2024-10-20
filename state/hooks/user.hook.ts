import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../reducers/user.reducer';

export const useUser = () => {
  const user = useSelector(selectCurrentUser);
  return useMemo(() => ({ user }), [user]);
};
