import PageContainer from "@sonamusica-fe/components/PageContainer";
import SearchAttendance from "@sonamusica-fe/components/Pages/Attendance/SearchAttendance";
import SearchResultAttendance from "@sonamusica-fe/components/Pages/Attendance/SearchResultAttendance";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import { UserType } from "@sonamusica-fe/types";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

enum Page {
  SEARCH,
  SEARCH_RESULT,
  RESULT_DETAIL
}

const AttendancePage = (): JSX.Element => {
  const { user } = useUser();
  const [page, setPage] = useState<Page>(Page.SEARCH);
  const { query, replace, push } = useRouter();

  const finishLoading = useApp((state) => state.finishLoading);

  const backButtonHandler = useCallback(() => {
    // we only allow Staff and Admin to access this search page
    if (user && user.privilegeType <= UserType.MEMBER) {
      navigateToHomePage();
    } else {
      navigateToSearchPage();
    }
  }, []);
  const navigateToSearchPage = useCallback(() => {
    setPage(Page.SEARCH);
    replace({ query: {} });
  }, []);
  const navigateToSearchResultPage = useCallback(() => setPage(Page.SEARCH_RESULT), []);
  const navigateToHomePage = useCallback(() => push("/"), []);

  useEffect(() => {
    finishLoading();
  }, []);

  useEffect(() => {
    if (query.teacher || query.course || query.student) {
      navigateToSearchResultPage();
    } else if (user && user.privilegeType <= UserType.MEMBER) {
      // we only allow Staff and Admin to access this search page
      navigateToHomePage();
    }
  }, [query, user]);

  const content =
    page === Page.SEARCH ? (
      <SearchAttendance />
    ) : (
      <SearchResultAttendance backButtonHandler={backButtonHandler} />
    );
  return <PageContainer navTitle="Manage Attendance">{content}</PageContainer>;
};

export default AttendancePage;
