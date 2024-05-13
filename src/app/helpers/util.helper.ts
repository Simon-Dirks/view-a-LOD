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
