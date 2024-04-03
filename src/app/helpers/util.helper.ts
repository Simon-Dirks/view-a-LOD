import { Settings } from '../config/settings';

export const removePrefix = (s: string): string => {
  for (const prefixToRemove of Settings.prefixesToHide) {
    s = stripBeforeStr(s, prefixToRemove);
  }
  return s;
};

export const wrapWithAngleBrackets = (s: string): string => {
  return `<${s}>`;
};

const stripBeforeStr = (inputStr: string, stripStr: string): string => {
  const index = inputStr.indexOf(stripStr);
  if (index !== -1) {
    return inputStr.substring(index + stripStr.length);
  }
  return inputStr;
};
