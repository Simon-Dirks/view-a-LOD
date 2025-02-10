import { Injectable } from '@angular/core';

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

  async getMimeType(url: string): Promise<string | null> {
    try {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          headers: {
            Accept: '*/*',
            'User-Agent': 'Mozilla/5.0',
          },
        });

        if (response.ok) {
          const mimeType = response.headers.get('content-type')?.split(';')[0];
          if (mimeType) {
            return mimeType;
          }
        }
      } catch (headError) {
        console.debug('HEAD request failed, trying fallbacks:', headError);
      }

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Range: 'bytes=0-0',
            Accept: '*/*',
            'User-Agent': 'Mozilla/5.0',
          },
        });

        if (response.ok || response.status === 206) {
          const mimeType = response.headers.get('content-type')?.split(';')[0];
          if (mimeType) {
            return mimeType;
          }
        }
      } catch (rangeError) {
        console.debug(
          'Range request failed, falling back to extension:',
          rangeError,
        );
      }

      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.toLowerCase();
        const extension = Object.keys(this.mimeTypeMap).find((ext) =>
          path.endsWith(ext),
        );
        return extension ? this.mimeTypeMap[extension] : null;
      } catch (urlError) {
        const extension = Object.keys(this.mimeTypeMap).find((ext) =>
          url.toLowerCase().endsWith(ext),
        );
        return extension ? this.mimeTypeMap[extension] : null;
      }
    } catch (error) {
      console.error('All MIME type detection methods failed:', error);
      return null;
    }
  }
}
