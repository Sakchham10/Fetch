import axios from "axios";
export const axiosRequest = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
});
