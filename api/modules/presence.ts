import { Presence } from "@sonamusica-fe/types";

import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "api";

type GetPresenceRequestConfig = GetRequestConfig & {
  classId: number;
};

const GetPresenceByClass = (
  { page = 1, resultsPerPage = 10000, classId }: GetPresenceRequestConfig = { classId: 0 }
): Promise<FailedResponse | SuccessResponse<Presence>> => {
  return API.get<Presence>({
    url: `${Routes.PRESENCE}/${classId}`,
    config: { params: { page, resultsPerPage } }
  });
};

export default {
  GetPresenceByClass
};
