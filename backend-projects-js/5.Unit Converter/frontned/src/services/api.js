import axios from "axios";

const API = axios.create({
  baseURL: "https://unit-converter-api-ds4g.onrender.com",
});

export default API;
