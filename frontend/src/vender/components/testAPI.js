import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/tests', // ✅ Update this if different
});

// Create a test
export const createTest = (data) => API.post('/createTest', data);

// Get all tests
export const getAllTests = () => API.get('/getAllTests');

// Update a test
export const updateTest = (id, data) => API.put(`/updateTest/${id}`, data);

// Delete a test
export const deleteTest = (id) => API.delete(`/deleteTest/${id}`);
