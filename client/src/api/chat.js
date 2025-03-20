import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;

export const getAIResponse = async (message, userId) => {
  try {
    const response = await axios.post(`${API_URL}/ai-coach`, {
      user_id: userId,
      message: message,
    });
    return response.data.reply; // ✅ Extract AI response
  } catch (error) {
    console.error("❌ AI Coach Error:", error);
    return "Sorry, I couldn't generate a response.";
  }
};
