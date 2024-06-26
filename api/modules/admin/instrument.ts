import { Instrument } from "@sonamusica-fe/types";
import {
  InstrumentUpdateFormRequest,
  InstrumentInsertFormRequest,
  InstrumentDeleteRequest
} from "@sonamusica-fe/types/form/admin/instrument";
import API, { AdminRoutes, FailedResponse, GetRequestConfig, SuccessResponse } from "api";

const GetAllInstrument = ({ page = 1, resultsPerPage = 10000 }: GetRequestConfig = {}): Promise<
  FailedResponse | SuccessResponse<Instrument>
> => {
  return API.get<Instrument>({
    url: AdminRoutes.INSTRUMENT,
    config: { params: { page, resultsPerPage } }
  });
};

const UpdateInstrument = (
  data: InstrumentUpdateFormRequest[]
): Promise<FailedResponse | SuccessResponse<Instrument>> => {
  return API.put<Instrument>({
    url: AdminRoutes.INSTRUMENT,
    config: { data: { data } }
  });
};

const InsertInstrument = (
  data: InstrumentInsertFormRequest[]
): Promise<FailedResponse | SuccessResponse<Instrument>> => {
  return API.post<Instrument>({
    url: AdminRoutes.INSTRUMENT,
    config: { data: { data } }
  });
};

const DeleteInstrument = (
  data: InstrumentDeleteRequest[]
): Promise<FailedResponse | SuccessResponse<undefined>> => {
  return API.delete<undefined>({
    url: AdminRoutes.INSTRUMENT,
    config: { data: { data } }
  });
};

export default { GetAllInstrument, InsertInstrument, UpdateInstrument, DeleteInstrument };
