import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Add JWT token in headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Subscription APIs
export const getAvailablePlans = () => API.get("/vender/subscription/plans");
export const purchaseSubscription = (planId) => API.post("/vender/subscription/purchase", { planId });

// Vendor Students APIs (restricted on backend)
export const getVendorStudents = () => API.get("/vender/students");
export const addStudent = (formData) => API.post("/vender/students", formData);
export const editStudent = (id, formData) => API.put(`/vender/students/${id}`, formData);
export const deleteStudent = (id) => API.delete(`/vender/students/${id}`);
