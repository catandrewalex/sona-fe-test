import React from "react";

type SearchResultProps<T> = {
  data: T[];
};

const SearchResult = <T extends unknown>({ data }: SearchResultProps<T>): JSX.Element => {
  return <div>SearchResult</div>;
};

export default SearchResult;
