import axios from "axios";

const API_URL = "http://localhost:5000/api/patients"; // Adjust based on backend

export const getPatients = async (currentPage, itemsPerPage) => axios.get(`${API_URL}?page=${currentPage}&limit=${itemsPerPage}`);
export const getPatientById = async (id) => axios.get(`${API_URL}/${id}`);
export const createPatient = async (data) => axios.post(API_URL, data);
export const updatePatient = async (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePatient = async (id) => axios.delete(`${API_URL}/${id}`);
