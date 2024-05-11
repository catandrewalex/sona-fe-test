import API, { useApiTransformer } from "@sonamusica-fe/api";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import SearchResultTeacherPayment from "@sonamusica-fe/components/Pages/TeacherPayment/SearchResultTeacherPayment";
import SearchTeacherPayment from "@sonamusica-fe/components/Pages/TeacherPayment/SearchTeacherPayment";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { TeacherPaymentUnpaidListItem } from "@sonamusica-fe/types";
import { ResponseMany } from "api";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useCallback, useEffect, useState } from "react";

const checkIfQueryResultAvailable = (query?: ParsedUrlQuery) => {
  return query && query.result;
};

const TeacherPaymentPage = (): JSX.Element => {
  const [data, setData] = useState<TeacherPaymentUnpaidListItem[]>();

  const { query, isReady } = useRouter();
  const apiTransformer = useApiTransformer();

  const { finishLoading, startLoading } = useApp((state) => ({
    finishLoading: state.finishLoading,
    startLoading: state.startLoading
  }));

  const onSearchComplete = useCallback((data: TeacherPaymentUnpaidListItem[]) => {
    setData(data);
  }, []);

  useEffect(() => {
    if (data === undefined && checkIfQueryResultAvailable(query)) {
      startLoading();
      API.GetUnpaidTeacherPaymentByMonthAndYear({
        month: query.month ? parseInt(query.month as string) : undefined,
        year: query.year ? parseInt(query.year as string) : undefined
      }).then((response) => {
        const result = apiTransformer(response, false);
        setData((result as ResponseMany<TeacherPaymentUnpaidListItem>).results);
        finishLoading();
      });
    } else {
      finishLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, data]);

  return (
    <PageContainer navTitle="Create Teacher Payment">
      {data && isReady && checkIfQueryResultAvailable(query) ? (
        <SearchResultTeacherPayment data={data} />
      ) : (
        <SearchTeacherPayment onSearchComplete={onSearchComplete} />
      )}
    </PageContainer>
  );
};

export default TeacherPaymentPage;
