import { useCallback } from "react";
import * as EmailValidator from "email-validator";

export type ValidationConfig<T = undefined> =
  | RequiredValidationConfig
  | EmailValidationConfig
  | MatchValidationConfig<T>
  | NotEmptyArrayConfig;

type ValidationName = "required" | "email" | "match" | "not-empty-array";

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

const notNull = (value: unknown): boolean => {
  return value !== null;
};

const required = (value: string | undefined | null): boolean => {
  return Boolean(value);
};

const notEmptyArray = (value: Array<any>): boolean => {
  return value.length > 0;
};

const validEmail = (value: string): boolean => {
  return value === "" || EmailValidator.validate(value);
};

export const useCheckNotNull = (field: string): ((value: unknown) => string) => {
  return useCallback((value: unknown) => {
    if (!notNull(value)) {
      return `${field} is required!`;
    }
    return "";
  }, []);
};

export const useCheckRequired = (field: string): ((value: string) => string) => {
  return useCallback((value: string) => {
    if (!required(value)) {
      return `${field} is required!`;
    }
    return "";
  }, []);
};

export const useNotEmptyArray = (field: string): ((value: Array<any>) => string) => {
  return useCallback((value: Array<any>) => {
    if (!notEmptyArray(value)) {
      return `${field} is required!`;
    }
    return "";
  }, []);
};

export const useCheckEmail = (field: string): ((value: string) => string) => {
  return useCallback((value: string) => {
    if (!validEmail(value)) {
      return `${field} is not valid!`;
    }
    return "";
  }, []);
};

export const useCheckMatch = (
  field: string
): ((value: string, matcher: string, matcherField: string) => string) => {
  return useCallback((value: string, matcher: string, matcherField: string) => {
    if (value !== matcher) {
      return `${field} and ${matcherField} do not match!`;
    }
    return "";
  }, []);
};
