import axios from "axios";

const api = axios.create({
  baseURL: "https://zyvo-backend-409g.onrender.com/api",
});

export default api;