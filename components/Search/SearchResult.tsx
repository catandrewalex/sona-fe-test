import { Masonry } from "@mui/lab";
import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import React from "react";

type SearchResultProps<T> = {
  data: T[];
  getDataKey: (data: T) => React.Key;
  getDataContent: (data: T) => JSX.Element | JSX.Element[] | string;
  getDataTitle: (data: T) => JSX.Element | string;
  getDataSubTitle?: (data: T) => string;
  getDataActions?: (data: T) => JSX.Element | JSX.Element[];
  maxHeight?: string | number;
};

const SearchResult = <T extends unknown>({
  data,
  maxHeight = "calc(100vh - 104px)",
  getDataContent,
  getDataKey,
  getDataTitle,
  getDataActions,
  getDataSubTitle
}: SearchResultProps<T>): JSX.Element => {
  const content = data.map((item) => (
    <Card key={getDataKey(item)} elevation={3}>
      <CardHeader
        title={getDataTitle(item)}
        sx={{ py: 0.5, borderBottom: "1px solid rgba(0,0,0,0.15)" }}
        titleTypographyProps={{ variant: "h6" }}
        subheader={getDataSubTitle?.(item)}
        subheaderTypographyProps={{ variant: "caption" }}
      />
      <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>{getDataContent(item)}</CardContent>
      {getDataActions && <CardActions>{getDataActions(item)}</CardActions>}
    </Card>
  ));

  return (
    <Box sx={{ mt: 2, p: 2, maxHeight, overflowY: "auto" }}>
      <Masonry spacing={3} columns={{ md: 2, xl: 4, lg: 3 }}>
        {content}
      </Masonry>
    </Box>
  );
};

export default SearchResult;
