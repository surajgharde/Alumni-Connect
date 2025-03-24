import axios from 'axios';
import { AlumniProfile, ApiResponse } from '@/types/types';

export const fetchRecommendations = async (): Promise<AlumniProfile[]> => {
  try {
    const response = await axios.get<ApiResponse<AlumniProfile[]>>('/api/recommendations');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    throw error;
  }
};

export const connectWithAlumni = async (alumniId: string): Promise<boolean> => {
  try {
    await axios.post('/api/connect', { alumniId });
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    throw error;
  }
};