import axios from "axios";

const API =
axios.create({
  baseURL:
    "https://unit-converter-api-ds4g.onrender.com/api",
});

export default API;