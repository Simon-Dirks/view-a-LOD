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

  async postData<T>(
    url: string,
    data: any,
    maxRetries: number = 3,
    retryInterval: number = 2000,
  ): Promise<T> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return (await response.json()) as T;
      } catch (error) {
        console.error('There was a problem with the API request:', error);
        retries++;
        if (retries < maxRetries) {
          console.log(`Retrying in ${retryInterval / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        } else {
          throw error;
        }
      }
    }

    throw new Error(
      `There was a problem with the API request: ${url} ${JSON.stringify(data)}`,
    );
  }
}
