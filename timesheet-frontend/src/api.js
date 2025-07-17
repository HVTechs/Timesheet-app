import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://timesheet-app-cjul.onrender.com/', // ✅ Replace with actual deployed backend
  withCredentials: true
});

export default instance;