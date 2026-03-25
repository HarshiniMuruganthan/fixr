import api from './axios'

export const bidsAPI = {
  create: (data) => api.post('/bids', data),
  getMy: () => api.get('/bids/my/all'),
  getForRepair: (repairRequestId) => api.get(`/bids/${repairRequestId}`),
  accept: (id) => api.put(`/bids/${id}/accept`),
}
