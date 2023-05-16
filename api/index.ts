import axios, { AxiosRequestConfig } from "axios";
import { deleteCookie, getCookie } from "@sonamusica-fe/utils/BrowserUtil";

// create new axios intance
const axiosIntance = axios.create({
  // change default base url
  baseURL: `${process.env.API_PROTOCOL}://${process.env.API_HOST}`
});

// create new request interceptor
axiosIntance.interceptors.request.use(async (req) => {
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
  const apiVersion = req.headers ? req.headers[API_CUSTOM_HEADER.apiVersion] : API_VERSION.v1;

  // if (apiVersion) req.baseURL = `${req.baseURL}/api/${apiVersion}`;
  // else req.baseURL = `${req.baseURL}/auth`;

  // req.withCredentials = true;

  return req;
});

type ResponseMany<T> = {
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
  public messages: Record<string, string>;
  public status: number;

  constructor(messages = {}, status = 502) {
    this.messages = messages;
    this.status = status;
  }
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
    try {
      const apiVersionHeader = auth ? {} : { [API_CUSTOM_HEADER.apiVersion]: version };
      const result = await (config?.headers
        ? axiosIntance.get(url, {
            headers: {
              ...config.headers,
              ...apiVersionHeader
            }
          })
        : axiosIntance.get(url, {
            headers: {
              ...apiVersionHeader
            }
          }));
      return new SuccessResponse(result.data.data, result.data.message);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          deleteCookie("SNMC");
          return new FailedResponse({ "non-field": "Authentication failed!" }, err.response.status);
        } else if (err.response.status === 502) {
          return new FailedResponse({ "non-field": "There is error on server!" });
        }
        return new FailedResponse(err.response.data as Record<string, string>, err.response.status);
      }
      return new FailedResponse({
        "non-field": "Failed to send the request! Please check your internet connection."
      });
    }
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
    try {
      const apiVersionHeader = auth ? {} : { [API_CUSTOM_HEADER.apiVersion]: version };
      const result = await (config?.headers
        ? axiosIntance.post(url, config?.data, {
            headers: {
              ...config.headers,
              ...apiVersionHeader
            }
          })
        : axiosIntance.post(url, config?.data, {
            headers: {
              ...apiVersionHeader
            }
          }));
      return new SuccessResponse(result.data.data, result.data.message);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          deleteCookie("SNMC");
          return new FailedResponse({ "non-field": "Authentication failed!" }, err.response.status);
        } else if (err.response.status === 502) {
          return new FailedResponse({ "non-field": "There is error on server!" });
        }
        return new FailedResponse(
          err.response.data.messages as Record<string, string>,
          err.response.status
        );
      }
      return new FailedResponse({
        "non-field": "Failed to send the request! Please check your internet connection."
      });
    }
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
    try {
      const apiVersionHeader = auth ? {} : { [API_CUSTOM_HEADER.apiVersion]: version };
      const result = await (config?.headers
        ? axiosIntance.put(url, config?.data, {
            headers: {
              ...config.headers,
              ...apiVersionHeader
            }
          })
        : axiosIntance.put(url, config?.data, {
            headers: {
              ...apiVersionHeader
            }
          }));
      return new SuccessResponse(result.data.data, result.data.message);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          deleteCookie("SNMC");
          return new FailedResponse({ "non-field": "Authentication failed!" }, err.response.status);
        } else if (err.response.status === 502) {
          return new FailedResponse({ "non-field": "There is error on server!" });
        }
        return new FailedResponse(err.response.data as Record<string, string>, err.response.status);
      }
      return new FailedResponse({
        "non-field": "Failed to send the request! Please check your internet connection."
      });
    }
  }
};

export default API;
