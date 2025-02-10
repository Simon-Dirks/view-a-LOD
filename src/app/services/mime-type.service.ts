import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root',
})
export class MimeTypeService {
  private readonly mimeTypeMap: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.html': 'text/html',
    '.htm': 'text/html',
  };

  getMimeType(url: string): string | null {
    try {
      if (
        (Settings.imageUrlSubstrings as string[]).some((substring) =>
          url.includes(substring),
        )
      ) {
        return 'image/jpeg';
      }

      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      const lastDotIndex = pathname.lastIndexOf('.');
      if (lastDotIndex === -1) {
        return null;
      }

      const extension = pathname.substring(lastDotIndex).toLowerCase();
      return this.mimeTypeMap[extension] || null;
    } catch (error) {
      console.error('Error parsing URL in getMimeType:', error);
      return null;
    }
  }
}
