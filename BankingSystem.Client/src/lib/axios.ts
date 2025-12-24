import axios from "axios";

export const apiClient = axios.create({
    baseURL: "api://your-api-base-url.com",
    headers: {
        'Content-Type': 'application/json'
    }
})