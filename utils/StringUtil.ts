const currencyFormatter = new Intl.NumberFormat("id", {
  style: "currency",
  currency: "IDR"

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const patternNumericStringWithEqualitySign = /([<>]=?)?\s*(\d+)/gi;

const equalitySignToComparator: Record<string, (a: number, b: number) => boolean> = {
  "": (a: number, b: number): boolean => a === b,
  ">": (a: number, b: number): boolean => a > b,
  ">=": (a: number, b: number): boolean => a >= b,
  "<": (a: number, b: number): boolean => a < b,
  "<=": (a: number, b: number): boolean => a <= b
};

/**
 * Extract a tuple from a string: equality sign & numeric value (e.g. ">3000" becomes [">", and 3000]).
 * @since 1.0.0
 * @version 1.0.0
 * @author Ferdiant Joshua Muis
 * @param {string} advancedNumericString a numeric string that may be prefixed with equality sign (either in [>, >=, <, <=])
 */
const extractEqualitySignAndNumberFromString = (
  advancedNumericString: string
): [string, number?] => {
  const matches = [...advancedNumericString.matchAll(patternNumericStringWithEqualitySign)][0];
  if (matches === undefined) {
    return ["", undefined];
  }

  const sign = matches[1] ?? "";
  const value = Number(matches[2]);
  return [sign, value];
};

/**
 * Check whether value satisfies advancedNumericString filter (e.g. 100 & "<200" will results in true).
 * @since 1.0.0
 * @version 1.0.0
 * @author Ferdiant Joshua Muis
 * @param {number} value a numeric value to be checked
 * @param {string} advancedNumericString a numeric string that may be prefixed with equality sign (either in [>, >=, <, <=])
 */
export const advancedNumberFilter = (value: number, advancedNumericString: string): boolean => {
  const [sign, filterValue] = extractEqualitySignAndNumberFromString(advancedNumericString.trim());
  if (filterValue === undefined) {
    return true;
  }
  return equalitySignToComparator[sign](value, filterValue);
};

export const titleCase = (text: string, separator = " "): string => {
  return text
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(separator);
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.substring(1);
};

export const convertNumberToCurrencyString = (value: number) => {
  return currencyFormatter.format(value);
};
