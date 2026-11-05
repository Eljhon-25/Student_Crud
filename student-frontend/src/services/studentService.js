import axios from 'axios';

/**
 * Resolves the backend base URL dynamically:
 * - When deployed on Render or provided via VITE_API_BASE_URL / VITE_API_URL: uses the remote URL
 * - In local dev (port 5173): uses relative /teves via Vite dev proxy
 * - Otherwise: falls back to http://localhost:8080/teves
 */
function getApiRoot() {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envUrl) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    const withoutProto = clean.replace(/^https?:\/\//i, '');
    if (!withoutProto.includes('.') && !withoutProto.includes('localhost')) {
      clean = `https://${withoutProto}.onrender.com`;
    } else if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }
  return typeof window !== 'undefined' && window.location.port === '5173'
    ? ''
    : 'http://localhost:8080';
}

const BASE_URL = `${getApiRoot()}/teves`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const studentService = {
  // Get all students
  async getAll() {
    const response = await apiClient.get('/all');
    return response.data;
  },

  // Get student by ID
  async getById(id) {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  // Create new student
  async create(studentData) {
    const payload = {
      name: studentData.name,
      email: studentData.email,
    };
    // Send both JSON body and query params for full compatibility with all backend configurations
    const response = await apiClient.post('/add', payload, {
      params: {
        name: studentData.name,
        email: studentData.email,
      },
    });
    return response.data;
  },

  // Update student
  async update(id, studentData) {
    const payload = {
      name: studentData.name,
      email: studentData.email,
    };
    const response = await apiClient.put(`/${id}`, payload, {
      params: {
        name: studentData.name,
        email: studentData.email,
      },
    });
    return response.data;
  },

  // Delete student
  async delete(id) {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },
};

export default studentService;
