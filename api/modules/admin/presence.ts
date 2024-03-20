import { Presence } from "@sonamusica-fe/types";
import {
  PresenceUpdateFormRequest,
  PresenceInsertFormRequest,
  PresenceDeleteRequest
} from "@sonamusica-fe/types/form/admin/presence";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllPresence = ({ page = 1, resultsPerPage = 10000 }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Presence>
> => {
  return API.get<Presence>({
    url: AdminRoutes.PRESENCE,
    config: { params: { page, resultsPerPage } }
  });
};

const UpdatePresence = (
  data: PresenceUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Presence>> => {
  return API.put<Presence>({
    url: AdminRoutes.PRESENCE,
    config: { data: { data } }
  });
};

const InsertPresence = (
  data: PresenceInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Presence>> => {
  return API.post<Presence>({
    url: AdminRoutes.PRESENCE,
    config: { data: { data } }
  });
};

const DeletePresence = (
  data: PresenceDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.PRESENCE,
    config: { data: { data } }
  });
};

export default {
  GetAllPresence,
  InsertPresence,
  UpdatePresence,
  DeletePresence
};
