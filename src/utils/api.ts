//function to make axios requests
import axios from "axios";
import { FilterParam } from "../interfaces/FilterParams";
export const axiosRequest = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
});
