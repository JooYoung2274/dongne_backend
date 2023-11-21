import axios from 'axios';

export interface getQueryType {
  query: string;
}

export class AxiosClass {
  constructor() {}

  async get<T>(url: string, data: getQueryType, key?: string): Promise<T> {
    const result = await axios.get(url, {
      params: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${key}`,
      },
    });
    return result.data;
  }
}
