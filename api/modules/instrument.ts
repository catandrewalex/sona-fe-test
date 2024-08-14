import API, { FailedResponse, GetRequestConfig, Routes, SuccessResponse } from "../index";
import { Instrument } from "@sonamusica-fe/types";

const GetInstrumentDropdownOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<Instrument>> => {
  return API.get<Instrument>({
    url: Routes.INSTRUMENT,
    config: { params: { page, resultsPerPage } }
  });
};

const GetInstrumentForDashboardOptions = ({
  page = 1,
  resultsPerPage = 10000
}: GetRequestConfig = {}): Promise<FailedResponse | SuccessResponse<Instrument>> => {
  return API.get<Instrument>({
    url: Routes.INSTRUMENT_FOR_DASHBOARD,
    config: { params: { page, resultsPerPage } }
  });
};
export default { GetInstrumentDropdownOptions, GetInstrumentForDashboardOptions };
