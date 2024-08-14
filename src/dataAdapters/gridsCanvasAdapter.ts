import apiClient from '../services/apiClient';
import { GridGameResponse } from '../types/gridGameTypes';

export const getPuzzles = async () => {
  try {
    const response = await apiClient.get('/puzzles');
    return response.data;
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    throw error;
  }
};

export const submitSolution = async (puzzleId: string, solution: any) => {
  try {
    const response = await apiClient.post(`/puzzles/${puzzleId}/solution`, solution);
    return response.data;
  } catch (error) {
    console.error('Error submitting solution:', error);
    throw error;
  }
};

// New function to start a new grid game
export const startNewGridGame = async (size?: number, seed?: number): Promise<GridGameResponse> => {
  try {
    const params = new URLSearchParams();
    if (size) params.append('size', size.toString());
    if (seed) params.append('seed', seed.toString());

    const response = await apiClient.get(`/grid?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error starting new grid game:', error);
    throw error;
  }
};
