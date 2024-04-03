export const removePrefix = (s: string): string => {
  return stripBeforeStr(s, '#');
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
