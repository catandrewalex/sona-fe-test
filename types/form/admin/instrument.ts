import { Instrument } from "@sonamusica-fe/types";

export type InstrumentUpsertFormData = Omit<Instrument, "instrumentId">;

export type InstrumentInsertFormRequest = InstrumentUpsertFormData;

export type InstrumentUpdateFormRequest = Instrument;

export type InstrumentDeleteRequest = {
  instrumentId: number;
};
