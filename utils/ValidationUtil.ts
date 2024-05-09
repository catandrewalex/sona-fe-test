import { useCallback } from "react";
import * as EmailValidator from "email-validator";

export type ValidationConfig<T = undefined> =
  | RequiredValidationConfig
  | EmailValidationConfig
  | MatchValidationConfig<T>
  | NotEmptyArrayConfig
  | NoBelowZeroValueConfig
  | PositiveNumberConfig;

type ValidationName =
  | "required"
  | "email"
  | "match"
  | "not-empty-array"
  | "no-below-zero"
  | "positive-number";

interface BaseValidationConfig {
  name: ValidationName;
}

interface RequiredValidationConfig extends BaseValidationConfig {
  name: "required";
}

interface EmailValidationConfig extends BaseValidationConfig {
  name: "email";
}

interface NotEmptyArrayConfig extends BaseValidationConfig {
  name: "not-empty-array";
}

interface MatchValidationConfig<T> extends BaseValidationConfig {
  name: "match";
  parameters: {
    matcherField: keyof T;
    matcherLabel?: string;
  };
}

interface NoBelowZeroValueConfig extends BaseValidationConfig {
  name: "no-below-zero";
}

interface PositiveNumberConfig extends BaseValidationConfig {
  name: "positive-number";
}

const notNull = (value: unknown): boolean => {
  return value !== null;
};

const required = (value: string | undefined | null): boolean => {
  return Boolean(value);
};

const notEmptyArray = (value: Array<unknown>): boolean => {
  return value.length > 0;
};

const validEmail = (value: string): boolean => {
  return value === "" || EmailValidator.validate(value);
};

export const useCheckNotNull = (field: string): ((value: unknown) => string) => {
  return useCallback(
    (value: unknown) => {
      if (!notNull(value)) {
        return `${field} is required!`;
      }
      return "";
    },
    [field]
  );
};

export const useCheckRequired = (field: string): ((value: string) => string) => {
  return useCallback(
    (value: string) => {
      if (!required(value)) {
        return `${field} is required!`;
      }
      return "";
    },
    [field]
  );
};

export const useNotEmptyArray = (field: string): ((value: Array<unknown>) => string) => {
  return useCallback(
    (value: Array<unknown>) => {
      if (!notEmptyArray(value)) {
        return `${field} is required!`;
      }
      return "";
    },
    [field]
  );
};

export const useCheckEmail = (field: string): ((value: string) => string) => {
  return useCallback(
    (value: string) => {
      if (!validEmail(value)) {
        return `${field} is not valid!`;
      }
      return "";
    },
    [field]
  );
};

export const useCheckMatch = (
  field: string
): ((value: string, matcher: string, matcherField: string) => string) => {
  return useCallback(
    (value: string, matcher: string, matcherField: string) => {
      if (value !== matcher) {
        return `${field} and ${matcherField} do not match!`;
      }
      return "";
    },
    [field]
  );
};

export const useCheckNoBelowZeroValue = (field: string): ((value: string) => string) => {
  return useCallback(
    (value: string) => {
      if (isNaN(parseInt(value))) {
        return `${field} is not a valid number!`;
      } else if (parseInt(value) < 0) {
        return `${field} must not negative value!`;
      }
      return "";
    },
    [field]
  );
};

export const useCheckPositiveNumberValue = (field: string): ((value: string) => string) => {
  return useCallback(
    (value: string) => {
      if (isNaN(parseInt(value))) {
        return `${field} is not a valid number!`;
      } else if (parseInt(value) <= 0) {
        return `${field} must be larger than 0!`;
      }
      return "";
    },
    [field]
  );
};
