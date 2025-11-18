import axiosInstance from "@/config/axiosConfig";

export class WebService {
  static async get<T>(version: string, path: string, headers?: Record<string, string>) {
    const url = `${version}${path}`;
    return axiosInstance.get<T>(url, { headers });
  }

  static async post<T>(version: string, path: string, body?: unknown, headers?: Record<string, string>) {
    const url = `${version}${path}`;
    return axiosInstance.post<T>(url, body, { headers });
  }
}
