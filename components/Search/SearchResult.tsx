import { Masonry } from "@mui/lab";
import { Box, Card, CardActions, CardContent, CardHeader } from "@mui/material";
import ErrorDataGridEmpty from "@sonamusica-fe/components/Error/ErrorDataGridEmpty";
import Tooltip from "@sonamusica-fe/components/Tooltip";
import React, { useEffect } from "react";

type SearchResultProps<T> = {
  data: T[];
  getDataKey: (data: T) => React.Key;
  getDataContent: (data: T) => JSX.Element | JSX.Element[] | string;
  getDataTitle: (data: T) => JSX.Element | string;
  getDataSubTitle?: (data: T) => string;
  getDataActions?: (data: T) => JSX.Element | JSX.Element[];
  getDataActionsTooltip?: (data: T) => string;
  onCardClick?: (data: T) => void;
};

const SearchResult = <T extends unknown>({
  data,
  getDataContent,
  getDataKey,
  getDataTitle,
  getDataActions,
  getDataActionsTooltip = (_data) => "",
  getDataSubTitle,
  onCardClick
}: SearchResultProps<T>): JSX.Element => {
  const content = data.map((item) => (
    <Card
      key={getDataKey(item)}
      elevation={3}
      sx={onCardClick ? { cursor: "pointer" } : {}}
      onClick={() => onCardClick?.(item)}
    >
      <CardHeader
        title={getDataTitle(item)}
        sx={{ py: 0.5, borderBottom: "1px solid rgba(0,0,0,0.15)" }}
        titleTypographyProps={{ variant: "h6" }}
        subheader={getDataSubTitle?.(item)}
        subheaderTypographyProps={{ variant: "caption" }}
      />
      <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>{getDataContent(item)}</CardContent>

      {getDataActions && (
        <Tooltip title={getDataActionsTooltip(item)}>
          <CardActions>{getDataActions(item)}</CardActions>
        </Tooltip>
      )}
    </Card>
  ));

  useEffect(() => {
    const interval = setInterval(() => {
      const searchFilterEl = document.getElementById("search-filter-container") as HTMLElement;
      const searchResultEl = document.getElementById("search-result-container") as HTMLElement;
      if (searchFilterEl && searchResultEl) {
        const height = searchFilterEl.clientHeight;
        searchResultEl.style.height = `calc(100vh - 120px - ${height}px)`;
        clearInterval(interval);
      }
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box
      sx={{ mt: 2, p: 2, height: "calc(100vh - 200px)", overflowY: "auto" }}
      id="search-result-container"
    >
      {content.length === 0 ? (
        <ErrorDataGridEmpty />
      ) : (
        <Masonry spacing={3} columns={{ md: 2, xl: 4, lg: 3 }}>
          {content}
        </Masonry>
      )}
    </Box>
  );
};

export default SearchResult;
