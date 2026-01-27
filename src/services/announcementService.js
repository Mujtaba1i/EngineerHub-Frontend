import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`
// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all announcements for student's enrolled classes
export async function getMyAnnouncements() {
  const response = await api.get('/my-announcements');
  return response.data;
}

// Get announcements for a specific class
export async function getClassAnnouncements(classId) {
  const response = await api.get(`/classes/${classId}/announcements`);
  return response.data;
}

// Create a new announcement (doctor only)
export async function createAnnouncement(announcementData) {
  const response = await api.post('/announcements', announcementData);
  return response.data;
}

// Update an announcement (doctor only)
export async function updateAnnouncement(announcementId, announcementData) {
  const response = await api.put(`/announcements/${announcementId}`, announcementData);
  return response.data;
}

// Delete an announcement (doctor only)
export async function deleteAnnouncement(announcementId) {
  const response = await api.delete(`/announcements/${announcementId}`);
  return response.data;
}