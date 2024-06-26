import { api }  from '../instance';

export const register = async (data) => {
    try {
        console.log(data);
        const response = await api.post('/users/signup', data);
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        
      console.log(error);
      throw error.response.data.message;
    }
};

export const login = async (data) => {
    try {
        const response = await api.post('/users/login', data);
        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
};

export async function getProfile () {
    try {
      const response = await api.get('/users/profile');
      localStorage.setItem("email", response.data.email)
      return response;
    } catch (error) {
      localStorage.setItem("token", null);
      console.log(error);
      throw error.response.data.message;
    }
  }


  export const logout = async () => {
    try {
        const response = await api.post('/users/logout');
        localStorage.setItem("token", null);
        return response.data;
    } catch (error) {
        throw error.response.data.message;
    }
};