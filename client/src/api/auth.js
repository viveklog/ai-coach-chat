import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL; // FastAPI server URL

export const signup = async (username, fullName) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { username, full_name: fullName });
    return response.data; // { token, user_id }
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Signup failed");
  }
};

export const login = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username });
    return response.data; // { token, user_id }
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};
