import { Box, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import { TeacherPaymentClassContainerProps } from "@sonamusica-fe/components/Pages/TeacherPayment/TeacherPaymentClassContainer";
import { convertNumberToCurrencyString } from "@sonamusica-fe/utils/StringUtil";
import React, { ReactElement } from "react";

interface TeacherPaymentInvoiceContainerProps {
  children: ReactElement<TeacherPaymentClassContainerProps>[];
  totalPaidValue: number;
}

const TeacherPaymentInvoiceContainer = ({
  children,
  totalPaidValue
}: TeacherPaymentInvoiceContainerProps): JSX.Element => {
  return (
    <Box sx={{ my: 2 }}>
      <Card elevation={5}>
        <CardHeader
          title={
            <>
              <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", pr: 4 }}>
                <Typography variant="h6">Items</Typography>
                <Typography variant="h6" align="center" sx={{ width: "200px" }}>
                  Sub Total
                </Typography>
              </Box>
            </>
          }
          sx={{ pb: 0, borderBottom: "5px solid rgba(0,0,0,0.1)" }}
        />
        <CardContent sx={{ py: 0, maxHeight: "calc(100vh - 340px)", overflowY: "scroll" }}>
          {children}
        </CardContent>
        <CardActions
          sx={{
            px: 3,
            py: 1.5,
            borderTop: "5px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <Typography variant="h6">Total</Typography>
          <Typography sx={{ width: "200px", mr: 3 }} align="center" variant="h6">
            {convertNumberToCurrencyString(totalPaidValue)}
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default TeacherPaymentInvoiceContainer;
