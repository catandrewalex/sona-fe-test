import API, { useApiTransformer } from "@sonamusica-fe/api";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import SearchResultTeacherPayment from "@sonamusica-fe/components/Pages/TeacherPayment/SearchResultTeacherPayment";
import SearchTeacherPayment from "@sonamusica-fe/components/Pages/TeacherPayment/SearchTeacherPayment";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { TeacherPaymentPaidListItem } from "@sonamusica-fe/types";
import { ResponseMany } from "../../api";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useCallback, useEffect, useState } from "react";

const checkIfQueryResultAvailable = (query?: ParsedUrlQuery) => {
  return query && query.result;
};

const EditTeacherPaymentPage = (): JSX.Element => {
  const [data, setData] = useState<TeacherPaymentPaidListItem[]>();

  const { query, isReady } = useRouter();
  const apiTransformer = useApiTransformer();

  const { finishLoading, startLoading } = useApp((state) => ({
    finishLoading: state.finishLoading,
    startLoading: state.startLoading
  }));

  const onSearchComplete = useCallback((data: TeacherPaymentPaidListItem[]) => {
    setData(data);
  }, []);

  useEffect(() => {
    if (data === undefined && checkIfQueryResultAvailable(query)) {
      startLoading();
      API.GetPaidTeacherPaymentByMonthAndYear({
        month: query.month ? parseInt(query.month as string) : undefined,
        year: query.year ? parseInt(query.year as string) : undefined
      }).then((response) => {
        const result = apiTransformer(response, false);
        setData((result as ResponseMany<TeacherPaymentPaidListItem>).results);
        finishLoading();
      });
    } else {
      finishLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, data]);

  return (
    <PageContainer navTitle="Edit Teacher Payment">
      {data && isReady && checkIfQueryResultAvailable(query) ? (
        <SearchResultTeacherPayment isEdit data={data} />
      ) : (
        <SearchTeacherPayment isEdit onSearchComplete={onSearchComplete} />
      )}
    </PageContainer>
  );
};

export default EditTeacherPaymentPage;
