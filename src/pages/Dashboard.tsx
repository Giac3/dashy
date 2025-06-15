import { useParams } from "react-router";
import { GridControls, GridLayout } from "../components";
import { DatabaseConnectionProvider, GridLayoutsProvider } from "../context";

const Dashboard = () => {
  const { url } = useParams();

  return (
    <DatabaseConnectionProvider url={url ? decodeURIComponent(url) : ""}>
      <GridLayoutsProvider>
        <GridLayout />
        <GridControls />
      </GridLayoutsProvider>
    </DatabaseConnectionProvider>
  );
};

export { Dashboard };
