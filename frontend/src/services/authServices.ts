import apiService from "./apiServices";
import { Auth } from '../types/types'; 
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  username: string;
}

const apiEndpoint = "/login"
const apiEndpointLogout = "/logout"

export const logout = async () => {
  return await apiService.post<{ message: string }, {}>(apiEndpointLogout, {});
}

export const login = async (data: Auth): Promise<any> => {
  return await apiService.post<{ message: string }, Auth>(apiEndpoint, data);
}

export const storeToken = (token: string) => {
  localStorage.setItem('authToken', token);
}

export const fetchToken = () => {
  return localStorage.getItem('authToken');
}

export const decodeToken = (token: string) => {
  const decodedToken: CustomJwtPayload = jwtDecode(token);

  return decodedToken
}

export const removeToken = () => {
  localStorage.removeItem('authToken');
}