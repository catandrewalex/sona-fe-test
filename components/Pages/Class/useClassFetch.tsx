import { Class } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";

type useClassFetchResult = {
  data: Class[];
  error: string;
  isLoading: boolean;
  refetch: () => void;
};

const useClassFetch = (): useClassFetchResult => {
  const [data, setData] = useState<Class[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const apiTransformer = useApiTransformer();

  const fetchData = async () => {
    setLoading(true);
    API.GetAllClass().then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        setData((parsedResponse as ResponseMany<Class>).results);
      } else {
        setError("Failed to fetch classes data!");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return { data, error, isLoading, refetch };
};

export default useClassFetch;
