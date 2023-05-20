export const capitalizeWord = (text: string, splitter = " ") => {
  return text
    .split(splitter)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(splitter);
};
