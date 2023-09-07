import { AxiosError, AxiosResponse } from 'axios';
import { formDataInstance, instance } from './instance';

const baseURL: string = 'http://34.64.122.168:3001';

const userToken = (): string | null =>
  localStorage.getItem('userToken') || null;

const get = async (endpoint: string): Promise<AxiosResponse> => {
  try {
    console.log(`GET: ${baseURL}${endpoint}`);
    const res: AxiosResponse = await instance.get(endpoint);
    if (res.data.message) {
      console.log(`MESSAGE: ${res.data.message}`, 'color: #a25cd1;');
    }
    return res;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.data) {
      console.log(`ERROR MESSAGE: ${axiosError.response.data}`);
    }
    console.error('GET ERROR', axiosError);
    throw error;
  }
};

const post = async (endpoint: string, data: any): Promise<AxiosResponse> => {
  try {
    console.log(`POST: ${baseURL}${endpoint}`);
    console.log(`DATA: ${JSON.stringify(data)}`);
    const res = await instance.post(endpoint, data);
    if (res.data.message) {
      console.log(`MESSAGE: ${res.data.message}`, 'color: #a25cd1;');
    }
    return res;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.data) {
      console.log(`ERROR MESSAGE: ${axiosError.response.data}`);
    }
    throw axiosError;
  }
};

const registerPost = async (
  endpoint: string,
  data: any,
): Promise<AxiosResponse> => {
  try {
    console.log(`POST: ${baseURL}${endpoint}`);
    console.log(`DATA: ${JSON.stringify(data)}`);
    const res = await instance.post(endpoint, data);
    if (res.data.message) {
      console.log(`MESSAGE: ${res.data.message}`, 'color: #a25cd1;');
    }
    return res;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('POST ERROR', error);
    if (axiosError.response && axiosError.response.data) {
      console.log(`ERROR MESSAGE: ${axiosError.response.data}`);
    }
    throw error;
  }
};

const postForm = async (endpoint: string, data: any) => {
  try {
    console.log(`POST: ${baseURL}${endpoint}`);
    console.log(`DATA: ${JSON.stringify(data)}`);
    const res = await formDataInstance.post(endpoint, data);
    if (res.data.message) {
      console.log(`MESSAGE: ${res.data.message}`, 'color: #a25cd1;');
    }
    return res;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('POST ERROR', error);
    if (axiosError.response && axiosError.response.data) {
      console.log(`ERROR MESSAGE: ${axiosError.response.data}`);
    }
    throw error;
  }
};

const put = async (endpoint: string, data: any) => {
  try {
    console.log(`PUH: ${baseURL}${endpoint}`);
    console.log(`DATA: ${JSON.stringify(data)}`);
    const filteredData: Record<string, any> = {};
    for (const key in data) {
      if (data[key] !== '') {
        filteredData[key] = data[key];
      }
    }
    console.log(`FILTERED DATA: ${JSON.stringify(filteredData)}`);
    const res = await instance.put(endpoint, filteredData);
    if (res.data.message) {
      console.log(`MESSAGE: ${res.data.message}`, 'color: #a25cd1;');
    }
    return res;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('POST ERROR', error);
    if (axiosError.response && axiosError.response.data) {
      console.log(`ERROR MESSAGE: ${axiosError.response.data}`);
    }
    throw error;
  }
};

const del = async (endpoint: string) => {
  try {
    console.log(`DELTE: ${baseURL}${endpoint} ${userToken}`);
    const res = await instance.delete(endpoint);
    if (res.data.message) {
      console.log(`MESSAGE: ${res.data.message}`, 'color: #a25cd1;');
    }
    return res;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('POST ERROR', error);
    if (axiosError.response && axiosError.response.data) {
      console.log(`ERROR MESSAGE: ${axiosError.response.data}`);
    }
    throw error;
  }
};
export { get, post, registerPost, postForm, put, del as delete };