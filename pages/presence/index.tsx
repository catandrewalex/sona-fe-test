import PageContainer from "@sonamusica-fe/components/PageContainer";
import SearchPresence from "@sonamusica-fe/components/Pages/Presence/SearchPresence";
import SearchResultPresence from "@sonamusica-fe/components/Pages/Presence/SearchResultPresence";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

enum Page {
  SEARCH,
  SEARCH_RESULT,
  RESULT_DETAIL
}

const PresencePage = (): JSX.Element => {
  const [page, setPage] = useState<Page>(Page.SEARCH);
  const { query } = useRouter();

  const finishLoading = useApp((state) => state.finishLoading);

  const navigateToSearchPage = useCallback(() => setPage(Page.SEARCH), []);
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
      <SearchPresence />
    ) : (
      <SearchResultPresence backButtonHandler={navigateToSearchPage} />
    );
  return <PageContainer navTitle="Manage Presence">{content}</PageContainer>;
};

export default PresencePage;
