import api from './axiosConfig'

export const getUsers = async () => await api.get('/users')

export const getProjects = async () => await api.get('/projects')