import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUsers } from '../reducers/users.reducer';

export const useUsers = () => {
  const users = useSelector(selectUsers);
  return useMemo(() => ({ users }), [users]);
};
