import api from './axios'

export const techniciansAPI = {
  getAll: () => api.get('/technicians'),
  getById: (id) => api.get(`/technicians/${id}`),
  search: (params) => api.get('/technicians/search', { params }),
  getCustomers: () => api.get('/technicians/customers'),
}
