import api from './axios'

export const repairsAPI = {
  create: (data) => api.post('/repairs', data),
  getAll: () => api.get('/repairs'),
  getMy: () => api.get('/repairs/my'),
  getAssigned: () => api.get('/repairs/assigned'),
  complete: (id) => api.put(`/repairs/${id}/complete`),
}
