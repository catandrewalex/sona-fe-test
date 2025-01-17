import { useEffect } from "react";
import PageContainer from "@sonamusica-fe/components/PageContainer";
import { useApp } from "@sonamusica-fe/providers/AppProvider";
import BatchClassUpdatePageComponent from "@sonamusica-fe/components/Pages/Class/BatchClassUpdatePageComponent";

export default function BatchClassUpdatePage(): JSX.Element {
  const finishLoading = useApp((state) => state.finishLoading);
  useEffect(() => finishLoading(), []);

  return (
    <PageContainer pageTitle="Manage Class" navTitle="Manage Class">
      <BatchClassUpdatePageComponent />
    </PageContainer>
  );
}
