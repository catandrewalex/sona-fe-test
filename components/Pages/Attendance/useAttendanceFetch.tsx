import { Attendance, PaginationState } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";

const default_Page = 1;
const default_ResultsPerPage = 12;

type useAttendanceFetchResult = {
  data: Attendance[];
  paginationState: PaginationState;
  error: string;
  isLoading: boolean;
  refetch: (studentId: number, page: number) => void;
};

const useAttendanceFetch = (
  classId: number,
  studentId: number,
  resultPerPage: number = default_ResultsPerPage
): useAttendanceFetchResult => {
  const [data, setData] = useState<Attendance[]>([]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    totalPages: 0,
    totalItems: 0,
    currentPage: 1
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const apiTransformer = useApiTransformer();

  const fetchData = async (studentId: number, page: number) => {
    setLoading(true);
    API.GetAttendanceByClass({
      page: page,
      resultsPerPage: resultPerPage,
      classId: classId,
      studentId: studentId
    })
      .then((response) => {
        const parsedResponse = apiTransformer(response, false);
        if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
          const results = parsedResponse as ResponseMany<Attendance>;
          setData(results.results);
          setPaginationState({
            totalPages: results.totalPages,
            totalItems: results.totalResults,
            currentPage: results.currentPage
          });
        } else {
          setError("Failed to fetch attendance data!");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(studentId, default_Page);
  }, []);

  const refetch = (studentId: number, page: number) => {
    fetchData(studentId, page);
  };

  return { data, paginationState, error, isLoading, refetch };
};

export default useAttendanceFetch;
