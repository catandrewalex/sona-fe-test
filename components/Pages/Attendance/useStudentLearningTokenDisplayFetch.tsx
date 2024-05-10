import { StudentWithStudentLearningTokensDisplay } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";

type useStudentLearningTokenDisplayFetchResult = {
  data: StudentWithStudentLearningTokensDisplay[];
  error: string;
  refetch: () => void;
};

const useStudentLearningTokenDisplayFetch = (
  classId: number
): useStudentLearningTokenDisplayFetchResult => {
  const [data, setData] = useState<StudentWithStudentLearningTokensDisplay[]>([]);
  const [error, setError] = useState<string>("");

  const apiTransformer = useApiTransformer();

  const fetchData = async (classId: number) => {
    API.GetStudentLearningTokenDisplayByClass(classId).then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        const results = parsedResponse as ResponseMany<StudentWithStudentLearningTokensDisplay>;
        setData(results.results);
      } else {
        setError("Failed to fetch student learning tokens data!");
      }
    });
  };

  useEffect(() => {
    fetchData(classId);
  }, []);

  const refetch = () => {
    fetchData(classId);
  };

  return { data, error, refetch };
};

export default useStudentLearningTokenDisplayFetch;
