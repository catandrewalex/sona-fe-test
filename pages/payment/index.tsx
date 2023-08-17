import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import { useCallback, useEffect, useState } from "react";
import SearchEnrollmentPayment from "@sonamusica-fe/components/Pages/Payment/SearchEnrollmentPayment";
import { EnrollmentPayment } from "@sonamusica-fe/types";
import SearchResultEnrollmentPayment from "@sonamusica-fe/components/Pages/Payment/SearchResultEnrollmentPayment";

enum Page {
  SEARCH,
  SEARCH_RESULT
}

const EnrollmentPaymentPage = (): JSX.Element => {
  const [page, setPage] = useState<Page>(Page.SEARCH);
  const [data, setData] = useState<Array<EnrollmentPayment>>([]);

  const finishLoading = useApp((state) => state.finishLoading);

  const onSearchSubmit = useCallback((data: EnrollmentPayment[]) => {
    setData(data);
    setPage(Page.SEARCH_RESULT);
  }, []);
  const moveToSearchPage = useCallback(() => setPage(Page.SEARCH), []);

  useEffect(() => {
    finishLoading();
  }, []);

  const content =
    page === Page.SEARCH ? (
      <SearchEnrollmentPayment onSearchSubmit={onSearchSubmit} />
    ) : (
      <SearchResultEnrollmentPayment
        data={data}
        backButtonHandler={moveToSearchPage}
        setData={setData}
      />
    );

  return <PageContainer navTitle="Enrollment Payment">{content}</PageContainer>;
};

export default EnrollmentPaymentPage;
