export const capitalizeWord = (text: string, separator = " "): string => {
  return text
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(separator);
};
