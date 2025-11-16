import axios from "axios";

const API_URL = "https://campus-connect-r0xz.onrender.com";

const axiosInstace = axios.create({
    baseURL: API_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstace
