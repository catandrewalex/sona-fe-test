import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp, useUser } from "@sonamusica-fe/providers/AppProvider";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useCallback, useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";
import { useRouter } from "next/router";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import useFormRenderer from "@sonamusica-fe/components/Form/FormRenderer";
import moment, { Moment } from "moment";
import SearchEnrollmentPayment from "@sonamusica-fe/components/Pages/Payment/SearchEnrollmentPayment";

enum Page {
  SEARCH,
  CARD_LIST
}

const EnrollmentPaymentPage = (): JSX.Element => {
  const router = useRouter();
  const [page, setPage] = useState<Page>(Page.SEARCH);
  const [data, setData] = useState<Array<EnrollmentPayment>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const [selectedData, setSelectedData] = useState<EnrollmentPayment>();

  const finishLoading = useApp((state) => state.finishLoading);
  const user = useUser((state) => state.user);
  const apiTransformer = useApiTransformer();

  const movePage = () => setPage(Page.CARD_LIST);

  useEffect(() => finishLoading(), [user]);

  console.log("page", page);
  const content =
    page === Page.SEARCH ? (
      <SearchEnrollmentPayment movePage={movePage} setData={setData} />
    ) : (
      <Box>
        <Typography>asdf</Typography>
      </Box>
    );

  return <PageContainer navTitle="Enrollment Payment">{content}</PageContainer>;
};

export default EnrollmentPaymentPage;
