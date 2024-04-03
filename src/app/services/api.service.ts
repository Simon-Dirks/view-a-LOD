import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return Promise.reject(new Error('Network response was not ok'));
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error('There was a problem with the API request:', error);
      throw error;
    }
  }

  async postData<T>(url: string, data: any): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        return Promise.reject(new Error('Network response was not ok'));
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error('There was a problem with the API request:', error);
      throw error;
    }
  }
}
