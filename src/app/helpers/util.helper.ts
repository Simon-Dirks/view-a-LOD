import { Settings } from '../config/settings';

export const removePrefixes = (s: string): string => {
  for (const prefixToRemove of Settings.prefixesToHide) {
    s = stripBeforeStr(s, prefixToRemove);
  }
  return s;
};

export const wrapWithAngleBrackets = (s: string): string => {
  return `<${s}>`;
};

export const truncate = (s: string, maxCharacters: number) => {
  if (s.length <= maxCharacters) {
    return s;
  } else {
    return s.substring(0, maxCharacters) + '...';
  }
};

const stripBeforeStr = (inputStr: string, stripStr: string): string => {
  const index = inputStr.indexOf(stripStr);
  if (index !== -1) {
    return inputStr.substring(index + stripStr.length);
  }
  return inputStr;
};
