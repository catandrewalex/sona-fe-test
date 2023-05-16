/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
import moment from "moment";

const digitRegex = /^([0-9]*)$/;
const noDigitRegex = /^([^0-9]*)$/;
const dateRegex = /((0[1-9])|([1-2][0-9])|(3[0-1]))\/((0[1-9])|(1[0-2]))\/[1-2]([0-9]{3})$/;
const kodePosRegex = /^([1-9])[0-9]{4}$/;
const phoneRegex = /0\d{3,16}$/;
const emailRegex =
  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

export const required = (value: string): boolean => {
  return value !== "";
};

export const maxChar = (value: string, max = 0): boolean => {
  return value.length <= max;
};

export const minChar = (value: string, min = 0): boolean => {
  return value.length >= min;
};

export const charLength = (value: string, length = 0): boolean => {
  return value.length === length;
};

export const noDigit = (value: string): boolean => {
  return noDigitRegex.test(value);
};

export const digitOnly = (value: string): boolean => {
  return digitRegex.test(value);
};

export const arrayNotEmpty = (value: Array<unknown>): boolean => {
  return value.length > 0;
};

export const validKodePos = (value: string, optional?: boolean): boolean => {
  return (optional && value === "") || kodePosRegex.test(value);
};

export const validPhone = (value: string, optional?: boolean): boolean => {
  return (optional && value === "") || phoneRegex.test(value);
};

export const validDate = (value: string, format?: string, optional?: boolean): boolean => {
  const minDate = new Date("1950-01-01").getTime();
  const now = new Date().getTime();
  const time = format ? moment(value, format).valueOf() : moment(value, "DD/MM/YYYY").valueOf();

  return (optional && value === "") || (dateRegex.test(value) && time <= now && time >= minDate);
};

export const validEmail = (value: string, optional?: boolean): boolean => {
  return (optional && value === "") || emailRegex.test(value);
};
