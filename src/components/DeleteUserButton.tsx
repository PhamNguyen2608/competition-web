import { useState } from 'react';
import AuthService from '../services/authService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from './ui/button';

export const DeleteUserButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    if (!user || !window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.fullDeleteUser(user.uid);
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra khi xóa tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <CustomButton
      onClick={handleDeleteUser}
      variant="outline"
      color="destructive"
      isLoading={isLoading}
      className="ml-2"
    >
      Xóa tài khoản
    </CustomButton>
  );
};
