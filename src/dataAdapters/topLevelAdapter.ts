import apiClient from '../services/apiClient';

export const getUserState = async () => {
  try {
    const response = await apiClient.get('/user/state');
    return response.data;
  } catch (error) {
    console.error('Error fetching user state:', error);
    throw error;
  }
};

export const getMultiplayerLobbies = async () => {
  try {
    const response = await apiClient.get('/lobbies');
    return response.data;
  } catch (error) {
    console.error('Error fetching lobbies:', error);
    throw error;
  }
};