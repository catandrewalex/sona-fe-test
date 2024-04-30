import PageContainer from "@sonamusica-fe/components/PageContainer";
import SearchResultTeacherPayment from "@sonamusica-fe/components/Pages/TeacherPayment/SearchResultTeacherPayment";
import SearchTeacherPayment from "@sonamusica-fe/components/Pages/TeacherPayment/SearchTeacherPayment";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import React, { useEffect, useState } from "react";

enum Page {
  SearchPage,
  ResultPage
}

const TeacherPaymentPage = () => {
  const [page, setPage] = useState<Page>(Page.ResultPage);

  const { finishLoading, startLoading } = useApp((state) => ({
    finishLoading: state.finishLoading,
    startLoading: state.startLoading
  }));

  useEffect(() => {
    finishLoading();
  }, []);

  return (
    <PageContainer navTitle="Teacher Payment">
      {page === Page.SearchPage ? <SearchTeacherPayment /> : <SearchResultTeacherPayment />}
    </PageContainer>
  );
};

export default TeacherPaymentPage;
