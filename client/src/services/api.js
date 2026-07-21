import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Exam Settings & Countdowns
  getExams: async () => {
    const res = await axios.get(`${API_BASE}/exams`);
    return res.data;
  },
  updateExams: async (data) => {
    const res = await axios.put(`${API_BASE}/exams`, data);
    return res.data;
  },

  // Timeline
  getTimeline: async () => {
    const res = await axios.get(`${API_BASE}/timeline`);
    return res.data;
  },
  addTimelineEvent: async (data) => {
    const res = await axios.post(`${API_BASE}/timeline`, data);
    return res.data;
  },
  updateTimelineEvent: async (id, data) => {
    const res = await axios.put(`${API_BASE}/timeline/${id}`, data);
    return res.data;
  },
  deleteTimelineEvent: async (id) => {
    const res = await axios.delete(`${API_BASE}/timeline/${id}`);
    return res.data;
  },

  // Subjects
  getSubjects: async () => {
    const res = await axios.get(`${API_BASE}/subjects`);
    return res.data;
  },
  addSubject: async (data) => {
    const res = await axios.post(`${API_BASE}/subjects`, data);
    return res.data;
  },
  updateSubject: async (id, data) => {
    const res = await axios.put(`${API_BASE}/subjects/${id}`, data);
    return res.data;
  },
  deleteSubject: async (id) => {
    const res = await axios.delete(`${API_BASE}/subjects/${id}`);
    return res.data;
  },

  // Study Logs
  getStudyLogs: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/study-log`, { params });
    return res.data;
  },
  logStudyHours: async (data) => {
    const res = await axios.post(`${API_BASE}/study-log`, data);
    return res.data;
  },

  // Mock Tests
  getMockTests: async (monthStr) => {
    const res = await axios.get(`${API_BASE}/mock-tests`, { params: { month: monthStr } });
    return res.data;
  },
  toggleMockTest: async (data) => {
    const res = await axios.post(`${API_BASE}/mock-tests`, data);
    return res.data;
  },

  // Streak
  getStreak: async () => {
    const res = await axios.get(`${API_BASE}/streak`);
    return res.data;
  },

  // Revision Tasks
  getRevisionTasks: async () => {
    const res = await axios.get(`${API_BASE}/revision-tasks`);
    return res.data;
  },
  addRevisionTask: async (data) => {
    const res = await axios.post(`${API_BASE}/revision-tasks`, data);
    return res.data;
  },
  updateRevisionTask: async (id, data) => {
    const res = await axios.put(`${API_BASE}/revision-tasks/${id}`, data);
    return res.data;
  },
  deleteRevisionTask: async (id) => {
    const res = await axios.delete(`${API_BASE}/revision-tasks/${id}`);
    return res.data;
  },

  // Notes
  getNotes: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/notes`, { params });
    return res.data;
  },
  uploadNote: async (formData) => {
    const res = await axios.post(`${API_BASE}/notes/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  deleteNote: async (id) => {
    const res = await axios.delete(`${API_BASE}/notes/${id}`);
    return res.data;
  }
};
