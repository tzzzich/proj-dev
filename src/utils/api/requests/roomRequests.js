import { api } from "../instance";

export const getRooms = async () => {
  try {
    const response = await api.get('/rooms/getRooms');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};

export const getUsers = async (roomId) => {
  try {
    const response = await api.get(`/rooms/getUsers?roomId=${roomId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};

export const getRoom = async (roomId) => {
  try {
    const response = await api.get(`/rooms/getRoom?roomId=${roomId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};

export const getTables = async (roomId) => {
  try {
    const response = await api.get(`/rooms/getTables?roomId=${roomId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};

export const renameRoom = async (roomId, data) => {
  try {
    const response = await api.put(`/rooms/renameRoom?roomId=${roomId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};


export const joinRoom = async (data) => {
  try {
    const response = await api.post(`/rooms/inviteUser`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.message;
  }
};