import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth"; // FastAPI server URL

export const signup = async (username, fullName) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, { username, full_name: fullName });
    return response.data; // { token, user_id }
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Signup failed");
  }
};

export const login = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username });
    return response.data; // { token, user_id }
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};
