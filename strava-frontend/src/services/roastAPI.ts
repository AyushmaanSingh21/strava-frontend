import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function generateRoast(accessToken: string) {
  const response = await axios.post(
    `${API_BASE_URL}/api/roast/generate`,
    { accessToken },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
}

export async function chatWithAI(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>,
  userData: any
) {
  const response = await axios.post(
    `${API_BASE_URL}/api/roast/chat`,
    { message, conversationHistory, userData },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data as { success: boolean; response: string };
}


