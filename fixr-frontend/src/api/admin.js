import api from './axios'

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getRepairs: () => api.get('/admin/repairs'),
}
