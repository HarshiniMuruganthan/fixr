import api from './axios'

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleVerify: (id) => api.patch(`/admin/users/${id}/verify`),
  toggleSuspend: (id) => api.patch(`/admin/users/${id}/suspend`),
  getRepairs: () => api.get('/admin/repairs'),
  deleteRepair: (id) => api.delete(`/admin/repairs/${id}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data),
}
