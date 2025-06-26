import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { TGridLayout, TGridLayouts } from "../types";
import { Loading } from "../components/loading";

import { getRecord, initStronghold, insertRecord } from "../utils/stronghold";
import { useParams } from "react-router";
import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";

type TGridLayoutsContext = {
  gridLayouts: TGridLayouts;
  setGridLayouts: Dispatch<SetStateAction<TGridLayouts | null>>;
  addGridLayout: (newLayout: TGridLayout) => void;
  removeGridLayout: (layoutId: string) => void;
  updateGridLayout: (updatedLayout: TGridLayout) => void;
};

export const GridLayoutsContext = React.createContext<TGridLayoutsContext>({
  gridLayouts: [],
  setGridLayouts: () => null,
  addGridLayout: () => null,
  removeGridLayout: () => null,
  updateGridLayout: () => null,
});

type TGridLayoutsProviderProps = {
  children: ReactNode;
};

const STRONGHOLD_VAULT_NAME = "DASHY_GRID_LAYOUTS_VAULT";
const STRONGHOLD_CLIENT_NAME = "DASHY_GRID_LAYOUTS_CLIENT";
const PASSWORD = "stronghold_grid_layouts_password";

const GridLayoutsProvider = ({ children }: TGridLayoutsProviderProps) => {
  const { serverId } = useParams();
  const [gridLayouts, setGridLayouts] = useState<TGridLayouts | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [stronghold, setStronghold] = useState<Stronghold | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { stronghold, client } = await initStronghold(
          STRONGHOLD_VAULT_NAME,
          STRONGHOLD_CLIENT_NAME,
          PASSWORD
        );
        setStronghold(stronghold);
        setClient(client);
        await stronghold.save();
        const store = client.getStore();
        const gridLayouts = await getRecord(
          store,
          `${serverId}-default-gridLayouts`
        );
        if (!gridLayouts) {
          setGridLayouts([]);
          setLoading(false);
          return;
        }
        setGridLayouts(JSON.parse(gridLayouts));
        setLoading(false);
      } catch (error) {
        setError(`Error initializing Stronghold: ${error}`);
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    if (!stronghold || !client) {
      console.error("Stronghold or client not initialized");
      return;
    }
    try {
      const store = client.getStore();
      await insertRecord(
        store,
        `${serverId}-default-gridLayouts`,
        JSON.stringify(gridLayouts)
      );
      await stronghold.save();
    } catch (error) {
      console.error(`Error saving grid layouts: ${error}`);
    }
  };

  useEffect(() => {
    if (!gridLayouts) return;
    save();
  }, [gridLayouts]);

  const addGridLayout = (newLayout: TGridLayout) => {
    setGridLayouts((prevLayouts) => {
      if (!prevLayouts) return [newLayout];
      return [...prevLayouts, newLayout];
    });
  };

  const removeGridLayout = (layoutId: string) => {
    setGridLayouts((prevLayouts) => {
      if (!prevLayouts) return [];
      return prevLayouts.filter((layout) => layout.i !== layoutId);
    });
  };

  const updateGridLayout = (updatedLayout: TGridLayout) => {
    setGridLayouts((prevLayouts) => {
      if (!prevLayouts) return [];
      return prevLayouts.map((layout) =>
        layout.i === updatedLayout.i ? updatedLayout : layout
      );
    });
  };

  if (loading || !gridLayouts) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        {error}
      </div>
    );
  }

  return (
    <GridLayoutsContext.Provider
      value={{
        gridLayouts,
        setGridLayouts,
        addGridLayout,
        removeGridLayout,
        updateGridLayout,
      }}
    >
      {children}
    </GridLayoutsContext.Provider>
  );
};

export { GridLayoutsProvider };
