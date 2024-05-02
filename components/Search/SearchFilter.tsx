/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Grid, GridSize } from "@mui/material";
import SearchArithmetic from "@sonamusica-fe/components/Search/SearchItem/SearchArithmatic";
import SearchDropdown from "@sonamusica-fe/components/Search/SearchItem/SearchDropdown";
import SearchText from "@sonamusica-fe/components/Search/SearchItem/SearchText";
import { useDebouncedCallback } from "@sonamusica-fe/utils/LodashUtil";
import React, { useEffect, useState } from "react";

interface SearchFilterConfigBase<T> {
  type: "text" | "select" | "arithmetic";
  label: string;
  filterHandle?: (data: T, value: any) => boolean;
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
}

interface SearchFilterTextConfig<T> extends SearchFilterConfigBase<T> {
  type: "text";
}

interface SearchFilterDropDownConfig<T> extends SearchFilterConfigBase<T> {
  type: "select";
  label: string;
  data: Array<any>;
  limitTags?: number;
  getOptionLabel: (option: any) => string;
}

interface SearchFilterArithmeticConfig<T> extends SearchFilterConfigBase<T> {
  type: "arithmetic";
}

type SearchFilterProps<T> = {
  data: T[];
  setData: (newData: T[]) => void;
  filters: Array<
    SearchFilterTextConfig<T> | SearchFilterDropDownConfig<T> | SearchFilterArithmeticConfig<T>
  >;
};

const SearchFilter = <T extends unknown>({
  data,
  setData,
  filters
}: SearchFilterProps<T>): JSX.Element => {
  const [filterValue, setFilterValue] = useState<Record<string, any>>({});

  const textSearchHandler = useDebouncedCallback(
    (column: string, value: string, filterHandle?: (data: T, value: any) => boolean) => {
      setFilterValue({
        ...filterValue,
        [column]: { value, filterHandle }
      });
    },
    500
  );

  const selectSearchHandler = useDebouncedCallback(
    (column: string, value: any[], filterHandle?: (data: T, value: any) => boolean) => {
      setFilterValue({
        ...filterValue,
        [column]: { value, filterHandle }
      });
    },
    100
  );

  const arithmaticSearchHandler = useDebouncedCallback(
    (column: string, value: any[], filterHandle?: (data: T, value: any) => boolean) => {
      setFilterValue({
        ...filterValue,
        [column]: { value, filterHandle }
      });
    },
    500
  );

  useEffect(() => {
    setData(
      data.filter((item: T) => {
        let result = true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [key, value] of Object.entries(filterValue)) {
          if (
            (Array.isArray(value.value) && value.value.length > 0) ||
            (typeof value.value === "string" && value.value !== "")
          ) {
            if (value.filterHandle) {
              result = result && value.filterHandle(item, value.value);
            } else {
              result =
                result &&
                (item as string).toString().toLowerCase().indexOf(value.value.toLowerCase()) !== -1;
            }
          }
        }
        return result;
      })
    );
  }, [filterValue]);

  const content = filters.map((filter) => {
    switch (filter.type) {
      case "text":
        return (
          <SearchText
            key={filter.label}
            xs={filter.xs}
            sm={filter.sm}
            md={filter.md}
            lg={filter.lg}
            xl={filter.xs}
            label={filter.label}
            value={filterValue[filter.label]?.value || ""}
            onChange={(value) => {
              textSearchHandler(filter.label, value, filter.filterHandle);
            }}
          />
        );
      case "select":
        return (
          <SearchDropdown
            key={filter.label}
            xs={filter.xs}
            sm={filter.sm}
            md={filter.md}
            lg={filter.lg}
            xl={filter.xs}
            label={filter.label}
            data={filter.data}
            getOptionLabel={filter.getOptionLabel}
            onChange={(value) => {
              selectSearchHandler(filter.label, value, filter.filterHandle);
            }}
            value={filterValue[filter.label]?.value || []}
          />
        );
      case "arithmetic":
        return (
          <SearchArithmetic
            key={filter.label}
            xs={filter.xs}
            sm={filter.sm}
            md={filter.md}
            lg={filter.lg}
            xl={filter.xs}
            label={filter.label}
            value={filterValue[filter.label]?.value.replaceAll(/[<=>]/g, "") || ""}
            onChange={(value) => {
              arithmaticSearchHandler(filter.label, value, filter.filterHandle);
            }}
          />
        );
    }
  });

  return (
    <Box sx={{ px: 2 }} id="search-filter-container">
      <Grid container>{content}</Grid>
    </Box>
  );
};
export default SearchFilter;
