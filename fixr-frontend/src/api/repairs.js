import api from './axios'

export const repairsAPI = {
  create: (data) => api.post('/repairs', data),
  getAll: () => api.get('/repairs'),
  getMy: () => api.get('/repairs/my'),
  getById: (id) => api.get(`/repairs/${id}`),
  getAssigned: () => api.get('/repairs/assigned'),
  complete: (id) => api.put(`/repairs/${id}/complete`),
}
