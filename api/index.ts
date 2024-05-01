/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { deleteCookie, getCookie } from "@sonamusica-fe/utils/BrowserUtil";

// create new axios intance
const axiosInstance = axios.create({
  // change default base url
  baseURL: `${process.env.API_PROTOCOL}://${process.env.API_HOST}`
});

// create new request interceptor
axiosInstance.interceptors.request.use(async (req) => {
  // include the authentication token on every request only if it available in the cookies
  if (getCookie("SNMC")) {
    if (req.headers) {
      req.headers.Authorization = `Bearer ${getCookie("SNMC")}`;
    } else {
      req.headers = { Authorization: `Bearer ${getCookie("SNMC")}` };
    }
  }

  if (process.env.ENVIRONMENT !== "production") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  // add api version number to base url
  // const apiVersion = req.headers ? req.headers[API_CUSTOM_HEADER.apiVersion] : API_VERSION.v1;

  // if (apiVersion) req.baseURL = `${req.baseURL}/api/${apiVersion}`;
  // else req.baseURL = `${req.baseURL}/auth`;

  // req.withCredentials = true;

  return req;
});

export type ResponseMany<T> = {
  results: Array<T>;
  totalPages: number;
  totalResults: number;
  currentPage: number;
};

export class SuccessResponse<T> {
  public data: ResponseMany<T> | T;
  public message?: string;

  constructor(data: ResponseMany<T> | T, message = "") {
    this.data = data;
    this.message = message;
  }
}

export class FailedResponse {
  public message?: string;
  public errors: Record<string, string>;
  public status: number;

  constructor(message?: string, status = 500, errors = {}) {
    this.errors = errors;
    this.status = status;
    this.message = message;
  }
}

export interface GetRequestConfig {
  page?: number;
  resultsPerPage?: number;
}

/**
 * Parameter that will be received on API object.
 * @typedef {Object} APIHttpMethod
 * @since 1.0.0
 * @version 1.0.0
 * @author Joshua Lauwrich Nandy
 * @property {string} url the request url (just include the path without base url)
 * @property {AxiosRequestConfig} [config] axios request config object
 * @property {string} [version="v1"] the api version
 */
type APIHttpMethod = {
  url: string;
  config?: AxiosRequestConfig;
  version?: string;
  auth?: boolean;
};

// all available api version
export const API_VERSION = {
  v1: "v1",
  v2: "v2"
};

// all available custom header name
export const API_CUSTOM_HEADER = {
  apiVersion: "X-API-VERSION"
};

async function httpResponseHandler(request: Promise<AxiosResponse<any, any>>) {
  try {
    const response = await request;
    return new SuccessResponse(
      response.data.data ? response.data.data : response.data.message,
      response.data.message
    );
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 401) {
        deleteCookie("SNMC");
        return new FailedResponse("Authentication failed!", err.response.status);
      } else if (err.response.status === 500) {
        return new FailedResponse("Sorry, something went wrong on our end.");
      } else if (err.response.status === 405) {
        return new FailedResponse("Wrong API call method! Please contact our admin.");
      }
      return new FailedResponse(
        err.response.data?.message,
        err.response.status,
        err.response.data?.errors as Record<string, string>
      );
    }
    return new FailedResponse("Failed to send the request! Please check your internet connection.");
  }
}
/**
 * Wrapper for axios request call
 */
const API = {
  /**
   * Perform get request to backend server.
   * @param {APIHttpMethod} params the params for the request
   * @property {string} params.url the request url (just include the path without base url)
   * @property {AxiosRequestConfig} [params.config] axios request config object
   * @property {string} [params.version="v1"] the api version
   * @returns
   * @example
   * const getPermission = () => {
   *    return API.get("permissions", { headers: { [API_CUSTOM_HEADER.example]: "header value" } });
   * }
   */
  get: async <T extends unknown>({
    url,
    config,
    auth,
    version = API_VERSION.v1
  }: APIHttpMethod): Promise<SuccessResponse<T> | FailedResponse> => {
    const apiVersionHeader = auth ? {} : { [API_CUSTOM_HEADER.apiVersion]: version };
    const headers = config?.headers ?? {};
    const request = axiosInstance.get(url, {
      headers: {
        ...headers,
        ...apiVersionHeader
      },
      params: config?.params ? config.params : {}
    });
    return httpResponseHandler(request);
  },

  /**
   * Perform post request to backend server.
   * @param {APIHttpMethod} params the params for the request
   * @property {string} params.url the request url (just include the path without base url)
   * @property {AxiosRequestConfig} [params.config] axios request config object
   * @property {string} [params.version="v1"] the api version
   * @returns
   * @example
   * const getReportByDate= ({ date: "2021-05-30" }) => {
   *    return API.post("reportByDate", { body: { date: date }, headers: { [API_CUSTOM_HEADER.example]: "header value" } }, API_VERSION.v2);
   * }
   */
  post: async <T extends unknown>({
    url,
    config,
    auth,
    version = API_VERSION.v1
  }: APIHttpMethod): Promise<SuccessResponse<T> | FailedResponse> => {
    const apiVersionHeader = auth ? {} : { [API_CUSTOM_HEADER.apiVersion]: version };
    const headers = config?.headers ?? {};
    const request = axiosInstance.post(url, config?.data, {
      headers: {
        ...headers,
        ...apiVersionHeader
      }
    });
    return httpResponseHandler(request);
  },
  /**
   * Perform put request to backend server.
   * @param {APIHttpMethod} params the params for the request
   * @property {string} params.url the request url (just include the path without base url)
   * @property {AxiosRequestConfig} [params.config] axios request config object
   * @property {string} [params.version="v1"] the api version
   * @returns
   * @example
   * const getReportByDate= ({ date: "2021-05-30" }) => {
   *    return API.put("reportByDate", { body: { date: date }, headers: { [API_CUSTOM_HEADER.example]: "header value" } }, API_VERSION.v2);
   * }
   */
  put: async <T extends unknown>({
    url,
    config,
    auth,
    version = API_VERSION.v1
  }: APIHttpMethod): Promise<SuccessResponse<T> | FailedResponse> => {
    const apiVersionHeader = auth ? {} : { [API_CUSTOM_HEADER.apiVersion]: version };
    const headers = config?.headers ?? {};
    const request = axiosInstance.put(url, config?.data, {
      headers: {
        ...headers,
        ...apiVersionHeader
      }
    });
    return httpResponseHandler(request);
  },
  delete: async <T extends unknown>({
    url,
    config,
    auth,
    version = API_VERSION.v1
  }: APIHttpMethod): Promise<SuccessResponse<T> | FailedResponse> => {
    const apiVersionHeader = auth ? {} : { [API_CUSTOM_HEADER.apiVersion]: version };
    const headers = config?.headers ?? {};
    const params = config?.params ?? {};
    const data = config?.data;
    const request = axiosInstance.delete(url, {
      headers: {
        ...headers,
        ...apiVersionHeader
      },
      ...params,
      data
    });
    return httpResponseHandler(request);
  }
};

export enum AdminRoutes {
  USER = "/admin/users",
  TEACHER = "/admin/teachers",
  STUDENT = "/admin/students",
  INSTRUMENT = "/admin/instruments",
  GRADE = "/admin/grades",
  COURSE = "/admin/courses",
  CLASS = "/admin/classes",
  TEACHER_SPECIAL_FEE = "/admin/teacherSpecialFees",
  STUDENT_LEARNING_TOKEN = "/admin/studentLearningTokens",
  STUDENT_ENROLLMENT = "/admin/studentEnrollments",
  ENROLLMENT_PAYMENT = "/admin/enrollmentPayments",
  ATTENDANCE = "/admin/attendances"
}

export enum Routes {
  PAYMENT = "/enrollmentPayments",
  TEACHER = "/teachers",
  STUDENT = "/students",
  COURSE = "/courses",
  CLASS = "/classes",
  STUDENT_ENROLLMENT = "/studentEnrollments",
  ATTENDANCE = "/attendances",
  TEACHER_SALARY = "/teacherPayments"
}

export default API;
