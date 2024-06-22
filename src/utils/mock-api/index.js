import api from './axiosConfig'

export const getUsers = async (id) => await api.get('/users', {
    params: {
      roomId : id
    }
  })

  export const getTables = async (id) => await api.get('/tables', {
    params: {
      roomId : id
    }
  })

export const getProjects = async () => await api.get('/projects')