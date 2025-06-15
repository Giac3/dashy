import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";


export const useQuery = (query: string) => {
    const [data, setData] = useState<Record<string, string | number>[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response: string = await invoke("execute_query", { query });
            setData(JSON.parse(response));
        } catch (err) {
            console.error("Error executing query:", err);
            setError(`Error: ${err}`);
            setLoading(false)
        } finally {
            setLoading(false);
        }
        setLoading(false);
        };
    
    useEffect(() => {
        fetchData();
    }, [query]);

    const rerun = () => {
        fetchData();
    }
    
    return { data, error, loading, rerun };
}