import { useContext, useEffect, useState } from "react";
import { StrongholdContext } from "../context";
import { TServer } from "../types";
import { getRecord, insertRecord } from "../utils/stronghold";


export const useServerManager = () => {
    const {stronghold, client } = useContext(StrongholdContext);
    const [servers, setServers] = useState<TServer[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            if (!stronghold || !client) {
                setLoading(false);
                return;
            }
            try {
                const store = client.getStore()
                const servers = await getRecord(store, "servers");
                if (!servers) {
                    setLoading(false);
                    return;
                }
                setServers(JSON.parse(servers));
            } catch (error) {
                setError(`Error fetching servers: ${error}`);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    const addServer = async (server: TServer) => {
         try {
                const store = client.getStore()
                const newServers = [...servers, server]
                setServers(newServers);
                await insertRecord(store, "servers", JSON.stringify(newServers));
                await stronghold.save();
            } catch (error) {
                setError(`Error saving server: ${error}`);
                setLoading(false);
            } finally {
                setLoading(false);
            }
    }

    const removeServer = async (id: string) => {
         try {
                const store = client.getStore()
                const newServers = servers.filter(s => s.id !== id)
                setServers(newServers);
                await insertRecord(store, "servers", JSON.stringify(newServers));
                await stronghold.save();
            } catch (error) {
                setError(`Error saving server: ${error}`);
                setLoading(false);
            } finally {
                setLoading(false);
            }
    }

    const updateServer = async (server: TServer) => {
         try {
                const store = client.getStore()
                const newServers = servers.map(s => s.id === server.id ? server : s)
                setServers(newServers);
                await insertRecord(store, "servers", JSON.stringify(newServers));
                await stronghold.save();
            } catch (error) {
                setError(`Error saving server: ${error}`);
                setLoading(false);
            } finally {
                setLoading(false);
            }
    }


    return {
        servers,
        loading,
        error,
        addServer,
        removeServer,
        updateServer,
    };
}