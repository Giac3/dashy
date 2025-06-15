import { invoke } from "@tauri-apps/api/core";
import React, { ReactNode, useEffect, useState } from "react";
import { Loading } from "../components/loading";

type TDatabaseConnectionContext = {
  connected: boolean;
  connect: () => void;
  error?: string | null;
  loading?: boolean;
};

export const DatabaseConnectionContext =
  React.createContext<TDatabaseConnectionContext>({
    connected: false,
    connect: () => null,
  });

type TDatabaseConnectionProviderProps = {
  children: ReactNode;
  url: string;
};

const DatabaseConnectionProvider = ({
  children,
  url,
}: TDatabaseConnectionProviderProps) => {
  const [connected, setConnected] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const connect = async () => {
    try {
      await invoke("connect", { url });
      setConnected(true);
    } catch (err) {
      setError(`Error: ${err}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    connect();
  }, [url]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        connected,
        connect,
        error,
        loading,
      }}
    >
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export { DatabaseConnectionProvider };
