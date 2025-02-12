// routes/loaders.ts
import { redirect } from 'react-router-dom';
import authService from '../services/authService';

export const protectedLoader = async () => {
  const user = await authService.getCurrentUser();
  if (!user) {
    throw redirect('/login');
  }
  // Tiến hành preload dữ liệu nếu cần
  return { user };
};
