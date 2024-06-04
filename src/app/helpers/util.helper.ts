import { Settings } from '../config/settings';

export const replacePrefixes = (s: string): string => {
  for (const [namespace, prefix] of Object.entries(
    Settings.namespacePrefixes,
  )) {
    s = s.replaceAll(namespace, prefix);
  }
  return s;
};

export const wrapWithAngleBrackets = (s: string): string => {
  return `<${s}>`;
};

export const wrapWithDoubleQuotes = (s?: string): string => {
  return `"${s}"`;
};

export const truncate = (
  s: string,
  maxCharacters: number,
  addEllipsis = false,
) => {
  if (s.length <= maxCharacters) {
    return s;
  } else {
    return s.substring(0, maxCharacters) + (addEllipsis ? '...' : '');
  }
};

export const isValidUrl = (s: string): boolean => {
  try {
    new URL(s);
    return true;
  } catch (_) {
    return false;
  }
};

export const isValidHttpUrl = (s: string): boolean => {
  let url;

  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

const stripBeforeStr = (inputStr: string, stripStr: string): string => {
  const index = inputStr.indexOf(stripStr);
  if (index !== -1) {
    return inputStr.substring(index + stripStr.length);
  }
  return inputStr;
};

export const intersects = (first: any[], second: any[]): boolean => {
  return first.some((item) => second.includes(item));
};

export const formatNumber = (n: number): string => {
  return n.toLocaleString('nl-NL');
};

// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + ' ' + units[u];
}

export const sortByArrayOrder = (
  mainArray: string[],
  orderArray: string[],
): string[] => {
  const orderMap = new Map<string, number>();
  orderArray.forEach((item, index) => orderMap.set(item, index));

  return mainArray.sort((a, b) => {
    const indexA = orderMap.has(a) ? orderMap.get(a) : Infinity;
    const indexB = orderMap.has(b) ? orderMap.get(b) : Infinity;

    if (indexA === undefined && indexB === undefined) {
      return 0;
    } else if (indexA === undefined) {
      return 1;
    } else if (indexB === undefined) {
      return -1;
    }

    return indexA - indexB;
  });
};
