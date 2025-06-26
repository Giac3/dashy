import { useParams } from "react-router";
import { GridControls, GridLayout } from "../components";
import { DatabaseConnectionProvider, GridLayoutsProvider } from "../context";
import { WidgetSettingsProvider } from "../context/WidgetSettingsProvider";

const Dashboard = () => {
  const { url } = useParams();

  return (
    <DatabaseConnectionProvider url={url ? decodeURIComponent(url) : ""}>
      <GridLayoutsProvider>
        <WidgetSettingsProvider>
          <GridLayout />
          <GridControls />
        </WidgetSettingsProvider>
      </GridLayoutsProvider>
    </DatabaseConnectionProvider>
  );
};

export { Dashboard };
