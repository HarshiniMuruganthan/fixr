import api from './axios'

export const messagesAPI = {
  getHistory: (receiverId) => api.get(`/messages/${receiverId}`),
}
