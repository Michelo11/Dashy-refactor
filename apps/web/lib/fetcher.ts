import axios from "axios";


export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const fetcher = (url: string) => axiosClient.get(url).then((res) => res.data);


