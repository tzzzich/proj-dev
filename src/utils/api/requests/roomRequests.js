import { api } from "../instance";

export const getRooms = async () => {
    try {
      const response = await api.get('/rooms/getRooms');
      console.log('getRooms:', response.data);
      return response;
    } catch (error) {
        console.log(error);
      throw error.message;
    }
  };