import axios from "axios";

const api = axios.create({
  baseURL: "https://zyvo-backend-409q.onrender.com/api",
});

export default api;