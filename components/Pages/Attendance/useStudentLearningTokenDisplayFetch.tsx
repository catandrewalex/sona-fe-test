import { StudentWithStudentLearningTokensDisplay } from "@sonamusica-fe/types";
import API, { useApiTransformer } from "@sonamusica-fe/api";
import { useEffect, useState } from "react";
import { FailedResponse, ResponseMany } from "api";

type useStudentLearningTokenDisplayFetchResult = {
  data: StudentWithStudentLearningTokensDisplay[];
  error: string;
  isLoading: boolean;
  refetch: () => void;
};

const useStudentLearningTokenDisplayFetch = (
  classId: number
): useStudentLearningTokenDisplayFetchResult => {
  const [data, setData] = useState<StudentWithStudentLearningTokensDisplay[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const apiTransformer = useApiTransformer();

  const fetchData = async (classId: number) => {
    setLoading(true);
    API.GetStudentLearningTokenDisplayByClass(classId).then((response) => {
      const parsedResponse = apiTransformer(response, false);
      if (Object.getPrototypeOf(parsedResponse) !== FailedResponse.prototype) {
        const results = parsedResponse as ResponseMany<StudentWithStudentLearningTokensDisplay>;
        setData(results.results);
      } else {
        setError("Failed to fetch student learning tokens data!");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData(classId);
  }, []);

  const refetch = () => {
    fetchData(classId);
  };

  return { data, error, isLoading, refetch };
};

export default useStudentLearningTokenDisplayFetch;
