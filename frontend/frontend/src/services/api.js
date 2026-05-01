import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://admintaskmanager-production.up.railway.app/",
});

export default API;