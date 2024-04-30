import { Masonry } from "@mui/lab";
import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import React from "react";

const SearchResultTeacherPayment = () => {
  return (
    <Box sx={{ mt: 2, p: 2, height: "calc(100vh - 200px)", overflowY: "auto" }}>
      <Masonry spacing={3} columns={{ md: 2, xl: 4, lg: 3 }}>
        <Card
          //   key={getDataKey(item)}
          elevation={3}
          //   sx={onCardClick ? { cursor: "pointer" } : {}}
          //   onClick={() => onCardClick?.(item)}
        >
          <CardHeader
            title={"TODO"}
            sx={{ py: 0.5, borderBottom: "1px solid rgba(0,0,0,0.15)" }}
            titleTypographyProps={{ variant: "h6" }}
            subheader={"TODO"}
            subheaderTypographyProps={{ variant: "caption" }}
          />
          <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
            <div>asdf</div>
          </CardContent>
        </Card>
      </Masonry>
    </Box>
  );
};

export default SearchResultTeacherPayment;
