import { Client, Store, Stronghold } from '@tauri-apps/plugin-stronghold';
// when using `"withGlobalTauri": true`, you may use
// const { Client, Stronghold } = window.__TAURI__.stronghold;
import { appDataDir } from '@tauri-apps/api/path';
// when using `"withGlobalTauri": true`, you may use
// const { appDataDir } = window.__TAURI__.path;

export const initStronghold = async (vaultName: string,clientName: string, password: string) => {
  const vaultPath = `${await appDataDir()}/${vaultName}.hold`;
  const stronghold = await Stronghold.load(vaultPath, password);

  let client: Client;
  try {
    client = await stronghold.loadClient(clientName);
  } catch {
    client = await stronghold.createClient(clientName);
  }

  return {
    stronghold,
    client,
  };
};


export async function insertRecord(store: Store, key: string, value: string) {
  const data = Array.from(new TextEncoder().encode(value));
  await store.insert(key, data);
}


export async function getRecord(store: Store, key: string): Promise<string | null> {
  const data = await store.get(key);
  
  return data ? new TextDecoder().decode(new Uint8Array(data)) : null;
}

