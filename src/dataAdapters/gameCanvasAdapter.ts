import apiClient from '../services/apiClient';

export const getGamesMetadata = async () => {
  try {
    const response = await apiClient.get('/games/metadata');
    return response.data;
  } catch (error) {
    console.error('Error fetching games metadata:', error);
    throw error;
  }
};

export const getGameById = async (gameId: string) => {
  try {
    const response = await apiClient.get(`/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game with ID ${gameId}:`, error);
    throw error;
  }
};