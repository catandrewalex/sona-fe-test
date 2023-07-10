export const titleCase = (text: string, separator = " "): string => {
  return text
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(separator);
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.substring(1);
};
