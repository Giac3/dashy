import React, { ReactNode, useEffect, useState } from "react";
import { Loading } from "../components/loading";
import { getRecord, initStronghold, insertRecord } from "../utils/stronghold";
import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { Button } from "../components";
import { genSalt, hash, compare } from "bcryptjs";
import Logo from "../assets/Logo.svg";
type TPasswordContext = {
  password: string;
};

export const PasswordContext = React.createContext<TPasswordContext>({
  password: "",
});

type TPasswordProviderProps = {
  children: ReactNode;
};

const STRONGHOLD_VAULT_NAME = "DASHY_UNSECURED_VAULT";
const STRONGHOLD_CLIENT_NAME = "DASHY_UNSECURED_CLIENT";
const UNSECURED_CLIENT_PASSWORD = "stronghold_unsecured_client_password";

const N_SALT_ROUNDS = 10;

const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(N_SALT_ROUNDS);

  return await hash(password, salt);
};

const PasswordProvider = ({ children }: TPasswordProviderProps) => {
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const passwordConfirmRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [passwordCheck, setPasswordCheck] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [stronghold, setStronghold] = useState<Stronghold | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  const check = async () => {
    try {
      const { stronghold, client } = await initStronghold(
        STRONGHOLD_VAULT_NAME,
        STRONGHOLD_CLIENT_NAME,
        UNSECURED_CLIENT_PASSWORD
      );

      const store = client.getStore();
      const key = "password";
      const value = await getRecord(store, key);

      if (value) {
        setLoading(false);
        setPasswordCheck(value);
        return;
      }

      setStronghold(stronghold);
      setClient(client);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(`Error getting password: ${error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    check();
  }, []);

  const validatePassword = async () => {
    if (!passwordCheck) {
      return;
    }
    setLoading(true);
    passwordRef.current?.blur();

    const inputPassword = passwordRef.current?.value;

    if (!inputPassword) {
      setPasswordError("Please enter a password.");
      return;
    }

    const same = await compare(inputPassword, passwordCheck);

    if (same) {
      setPassword(inputPassword);
    }
    setLoading(false);
  };

  const savePassword = async () => {
    if (!passwordRef.current?.value) {
      setPasswordError("Please enter a password.");
      return;
    }

    if (passwordRef.current.value !== passwordConfirmRef.current?.value) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!client || !stronghold) {
      return;
    }

    try {
      passwordRef.current?.blur();
      passwordConfirmRef.current?.blur();
      setLoading(true);
      const inputPassword = passwordRef.current.value;

      console.log("Hashing.");
      const hashedPassword = await hashPassword(inputPassword);
      console.log("Getting store.");
      const store = client.getStore();
      const key = "password";

      console.log("Inserting.");
      await insertRecord(store, key, hashedPassword);

      console.log("Saving.");
      await stronghold.save();
      console.log("Saved.");
      setPassword(inputPassword);
      setLoading(false);
    } catch (error) {
      console.error("Error saving password:", error);
      setError(`Error saving password: ${error}`);
      setLoading(false);
    }
  };
  if (error) {
    return <div className="flex items-center justify-center">{error}</div>;
  }

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (passwordCheck && !password) {
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col gap-12">
        <img src={Logo} alt="Logo" className="w-18 h-18" />

        <div className="flex max-w-64 w-full flex-col gap-2">
          <input
            type="password"
            className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            ref={passwordRef}
            placeholder="Password"
          />
          {passwordError && <p className="text-red mt-2">{passwordError}</p>}
          <Button onClick={validatePassword}>
            <p className="text-sm">Submit</p>
          </Button>
        </div>
      </div>
    );
  }
  if (!password) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex max-w-64 w-full flex-col gap-2">
          <p>Create a password.</p>
          <input
            type="password"
            className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            ref={passwordRef}
            placeholder="Password"
          />
          <input
            type="password"
            className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            ref={passwordConfirmRef}
            placeholder="Password"
          />
          {passwordError && <p className="text-red mt-2">{passwordError}</p>}
          <Button onClick={savePassword}>
            <p className="text-sm">Submit</p>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PasswordContext.Provider value={{ password }}>
      {children}
    </PasswordContext.Provider>
  );
};

export { PasswordProvider };
