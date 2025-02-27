import {
  Class,
  Course,
  Student,
  StudentLearningToken,
  StudentLearningTokenDisplay,
  Teacher,
  User,
  UserDetail
} from "@sonamusica-fe/types";
import moment from "moment";
import { Moment } from "moment";

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

export const convertNumberToCurrencyString = (value: number): string => {
  return currencyFormatter.format(value);
};

export const convertNumberToCurrencyStringWithoutPrefixAndSuffix = (value: number): string => {
  const result = currencyFormatter.format(value);
  return result.substring(3, result.length - 3);
};

export const convertNumberToPercentage = (value: number, fractionDigits = 0): string => {
  if (!Number.isFinite(value)) {
    return "N/A";
  }

  if (fractionDigits < 0) {
    fractionDigits = 0;
  }
  const result = `${value.toFixed(fractionDigits)} %`;
  if (fractionDigits > 0) return result.replaceAll(".", ",");
  return result;
};

export const getFullNameFromUser = (user?: User): string => {
  return getFullNameFromUserDetail(user?.userDetail);
};

export const getFullNameFromUserDetail = (userDetail?: UserDetail): string => {
  return userDetail
    ? `${userDetail.firstName}${userDetail.lastName ? " " + userDetail.lastName : ""}`
    : "<anonymous>";
};

export const getFullNameFromTeacher = (teacher?: Teacher): string => {
  return teacher ? getFullNameFromUser(teacher.user) : "No Teacher";
};

export const getFullNameFromStudent = (student?: Student): string => {
  return student ? getFullNameFromUser(student.user) : "No Student";
};

export const getFullClassName = (_class?: Class): string => {
  if (!_class) return "No Class";

  return `${getMinimalClassName(_class)} (${getCourseName(_class.course)})`;
};

export const getMinimalClassName = (_class?: Class): string => {
  if (!_class) return "No Class";

  const studentsNames = _class.students
    ? _class.students.map((student) => getFullNameFromStudent(student))
    : [];

  return `#${_class.classId} \
  ${getFullNameFromTeacher(_class.teacher)} - [${studentsNames.join(", ")}]`;
};

export const getCourseName = (course?: Course): string => {
  return course ? `${course.instrument.name} - ${course.grade.name}` : "No Course";
};

export const getFullStudentLearningTokenName = (token?: StudentLearningToken): string => {
  if (!token) return "";

  const tokenDetail = getMinimalStudentLearningTokenName(token);

  let studentTeacherName = "";
  let courseName = "";
  if (token.studentEnrollment) {
    studentTeacherName = `\
    Student: ${token.studentEnrollment.student.user.username} \
    ┊ Teacher: ${token.studentEnrollment.class.teacher?.user.username ?? ""}`;

    courseName = getCourseName(token.studentEnrollment.class.course);
  }

  const builder = [tokenDetail, studentTeacherName, courseName].filter((val) => val.length > 0);

  return builder.join(" ⟶ ");
};

export const getMinimalStudentLearningTokenName = (token?: StudentLearningTokenDisplay): string => {
  if (!token) return "";

  const tokenDateInfo = `Crt: ${moment(token.createdAt).format("DD MMMM YYYY")} \
  ┊ Updt: ${moment(token.lastUpdatedAt).format("DD MMMM YYYY")}`;

  const tokenDetail = `\
  #${token.studentLearningTokenId} \
  Course: ${convertNumberToCurrencyString(token.courseFeeValue)} \
  ┊ Transport: ${convertNumberToCurrencyString(token.transportFeeValue)} \
  ┊ Quota: ${token.quota} ┊ ${tokenDateInfo}`;

  return tokenDetail;
};

export const searchFullNameByValue = (value: string, user?: User): boolean => {
  if (!user) return false;

  if (user.userDetail.firstName.toLowerCase().includes(value.toLowerCase())) return true;

  if (user.userDetail.lastName) {
    if (user.userDetail.lastName.toLowerCase().includes(value.toLowerCase())) return true;
  }

  return getFullNameFromUser(user).toLowerCase().includes(value.toLowerCase());
};

export const searchCourseNameByValue = (value: string, course?: Course): boolean => {
  if (!course) return false;

  if (course.instrument.name.toLowerCase().includes(value.toLowerCase())) return true;

  if (course.grade.name.toLowerCase().includes(value.toLowerCase())) return true;

  return getCourseName(course).toLowerCase().includes(value.toLowerCase());
};

export const convertMomentDateToRFC3339 = (date: Moment): string => {
  return date.format();
};

export const removeNonNumericCharacter = (num: string): string =>
  num.toString().replace(/[^0-9]/g, "");

export const isValidNumericString = (value: unknown): boolean => {
  return Boolean(value) && typeof value === "string" && !isNaN(+value);
};

export type FormattedMonthName = {
  text: string;
  month: number;
  year: number;
};

export const getMonthNamesFromTwoMomentInstance = <
  B extends boolean | undefined = undefined,
  R = B extends boolean ? (B extends true ? FormattedMonthName[] : string[]) : string[]
>(
  start: Moment,
  end: Moment,
  config?: {
    asObject?: B;
    format?: string;
  }
): R => {
  const interim = start.clone();
  const result: any[] = [];

  while (end > interim || interim.format("M") === end.format("M")) {
    const formattedText = interim.format(config?.format ?? "MMM'YY");
    if (config?.asObject) {
      result.push({
        text: formattedText,
        month: interim.month() + 1,
        year: interim.year()
      });
    } else {
      result.push(formattedText);
    }
    interim.add(1, "month");
  }
  return result as unknown as R;
};
