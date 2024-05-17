export const DeduplicateArrayOfObjects = (array: any[], key: string): any[] => {
  return [...new Map(array.map((item: any) => [item[key], item])).values()];
};
