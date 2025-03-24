import axios from 'axios';
import { signIn, signOut } from 'next-auth/react';
import { UserProfileData } from '@/types/types';

export const loginUser = async (provider: 'google' | 'github') => {
  try {
    const result = await signIn(provider, { redirect: false });
    return { success: !result?.error, error: result?.error };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
};

export const logoutUser = async () => {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Logout failed' };
  }
};

export const fetchUserProfile = async (): Promise<UserProfileData> => {
  try {
    const response = await axios.get('/api/auth/session');
    return response.data.user;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};