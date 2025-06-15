import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Loading } from "../components/loading";
import { initStronghold } from "../utils/stronghold";
import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { PasswordContext } from "./PasswordProvider";

type TStrongholdContext = {
  stronghold: Stronghold;
  client: Client;
};

export const StrongholdContext = React.createContext<TStrongholdContext>(
  {} as TStrongholdContext
);

type TStrongholdProviderProps = {
  children: ReactNode;
};
const STRONGHOLD_VAULT_NAME = "DASHY_SECURE_VAULT";
const STRONGHOLD_CLIENT_NAME = "DASHY_SECURE_CLIENT";

const StrongholdProvider = ({ children }: TStrongholdProviderProps) => {
  const { password } = useContext(PasswordContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [stronghold, setStronghold] = useState<Stronghold>();
  const [client, setClient] = useState<Client>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { stronghold, client } = await initStronghold(
          STRONGHOLD_VAULT_NAME,
          STRONGHOLD_CLIENT_NAME,
          password
        );
        setStronghold(stronghold);
        setClient(client);
        await stronghold.save();
        setLoading(false);
      } catch (error) {
        setError(`Error initializing Stronghold: ${error}`);
        setLoading(false);
      }
    })();
  }, [password]);

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
        {error}
      </div>
    );
  }
  if (!stronghold || !client) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <p>Stronghold is not initialized properly.</p>
      </div>
    );
  }

  return (
    <StrongholdContext.Provider value={{ stronghold, client }}>
      {children}
    </StrongholdContext.Provider>
  );
};

export { StrongholdProvider };
