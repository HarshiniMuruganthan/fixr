import api from './axios'

export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getForTechnician: (technicianId) => api.get(`/reviews/${technicianId}`),
}
