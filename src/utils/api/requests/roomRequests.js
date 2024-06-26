import { api } from "../instance";

export const getRooms = async () => {
  try {
    const response = await api.get('/rooms/getRooms');
    return response.data;
  } catch (error) {
    console.log(error);
    localStorage.setItem('token', null);
    throw error.response.data.message;
  }
};

export const getUsers = async (roomId) => {
  try {
    const response = await api.get(`/rooms/getUsers?roomId=${roomId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.message;
  }
};

export const getRoom = async (roomId) => {
  try {
    const response = await api.get(`/rooms/getRoom?roomId=${roomId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    ocalStorage.setItem('token', null);
    throw error.response.data.message;
  }
};

export const getTables = async (roomId) => {
  try {
    const response = await api.get(`/rooms/getTables?roomId=${roomId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.message;
  }
};

export const renameRoom = async (roomId, data) => {
  try {
    const response = await api.put(`/rooms/renameRoom?roomId=${roomId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.data.message) 
    {
      throw error.response.data.message 
    }
    throw error.response.data.error;
  }
};

export const changeTableName = async (tableId, data) => {
  try {
    const response = await api.put(`/tables/renameTable?tableId=${tableId}`, data);
    return response;
  } catch (error) {
    console.log(error);
    if (error.response.data.message) 
    {
      throw error.response.data.message 
    }
    else if (error.response.data.error) {
      throw error.response.data.error;
    } else throw error.message;
  }
};

export const addUser = async (roomId, data) => {
  try {
    const response = await api.post(`/rooms/addUser?roomId=${roomId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.data.message) 
    {
      throw error.response.data.message 
    }
    throw error.response.data.error;
  }
};

export const deleteUser = async (roomId, id) => {
  try {
    const response = await api.delete(`/rooms/deleteUserRoom?roomId=${roomId}&user_id=${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.data.message) 
    {
      throw error.response.data.message 
    }
    throw error.response.data.error;
  }
};

export const createRoom = async (data) => {
  try {
    const response = await api.post(`/rooms/addRoom`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response.data.message) 
    {
      throw error.response.data.message 
    }
    throw error.response.data.error;
  }
};

export const joinRoom = async (data) => {
  try {
    const response = await api.post(`/rooms/inviteUser`, data);
    return response.data;
  } catch (error) {
    if (error.response.data.message) 
    {
      throw error.response.data.message 
    }
    throw error.response.data.error;
  }
};