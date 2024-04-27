import PageContainer from "@sonamusica-fe/components/PageContainer";
import SearchAttendance from "@sonamusica-fe/components/Pages/Attendance/SearchAttendance";
import SearchResultAttendance from "@sonamusica-fe/components/Pages/Attendance/SearchResultAttendance";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

enum Page {
  SEARCH,
  SEARCH_RESULT,
  RESULT_DETAIL
}

const AttendancePage = (): JSX.Element => {
  const [page, setPage] = useState<Page>(Page.SEARCH);
  const { query, replace } = useRouter();

  const finishLoading = useApp((state) => state.finishLoading);

  const navigateToSearchPage = useCallback(() => {
    setPage(Page.SEARCH);
    replace({ query: {} });
  }, []);
  const navigateToSearchResultPage = useCallback(() => setPage(Page.SEARCH_RESULT), []);

  useEffect(() => {
    finishLoading();
  }, []);

  useEffect(() => {
    if (query.teacher || query.course || query.student) {
      navigateToSearchResultPage();
    }
  }, [query]);

  const content =
    page === Page.SEARCH ? (
      <SearchAttendance />
    ) : (
      <SearchResultAttendance backButtonHandler={navigateToSearchPage} />
    );
  return <PageContainer navTitle="Manage Attendance">{content}</PageContainer>;
};

export default AttendancePage;
