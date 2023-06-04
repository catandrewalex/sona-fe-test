import { useCallback } from "react";
import * as EmailValidator from "email-validator";

const required = (value: string | undefined | null): boolean => {
  return Boolean(value);
};

const validEmail = (value: string): boolean => {
  return EmailValidator.validate(value);
};

export const useCheckRequired = (
  onError: (error: string) => void,
  field?: string
): ((value: string) => boolean) => {
  return useCallback((value: string) => {
    if (!required(value)) {
      onError(`${field || "This field"} is required!`);
      return false;
    } else {
      onError("");
      return true;
    }
  }, []);
};

export const useCheckEmail = (
  onError: (error: string) => void,
  field?: string
): ((value: string) => boolean) => {
  return useCallback((value: string) => {
    if (!validEmail(value)) {
      onError(`${field || "This field"} is not valid!`);
      return false;
    } else {
      onError("");
      return true;
    }
  }, []);
};

export const useCheckMatch = (
  onError: (error: string) => void,
  field?: string
): ((value: string, confirmation: string) => boolean) => {
  return useCallback((value: string, confirmation: string) => {
    if (value !== confirmation) {
      onError(`${field || "This field"} do not match!`);
      return false;
    } else {
      onError("");
      return true;
    }
  }, []);
};
