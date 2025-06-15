import { useEffect, useState } from "react";
import type { TServer } from "../../types";

import { Button } from "../button";
import { IconDatabase, IconX } from "@tabler/icons-react";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
interface AddServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (server: TServer) => void;
}

const colorOptions = [
  "#6b7280",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
];

const URL_PATTERN = /^(postgresql:\/\/)([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)$/;

export const AddServerModal = ({
  isOpen,
  onClose,
  onSave,
}: AddServerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    host: "localhost",
    port: 5432,
    database: "",
    username: "",
    password: "",
    ssl: false,
    color: colorOptions[0],
  });

  const handleSave = () => {
    const url = `postgresql://${formData.username}:${formData.password}@${formData.host}:${formData.port}/${formData.database}`;
    onSave({
      ...formData,
      url,
      id: crypto.randomUUID(),
    });
    onClose();
    setFormData({
      name: "",
      host: "localhost",
      port: 5432,
      database: "",
      username: "",
      password: "",
      ssl: false,
      color: colorOptions[0],
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const text = await readText();

        const match = text.match(URL_PATTERN);
        if (match) {
          const [, , username, password, host, port, database] = match;
          setFormData({
            name: "",
            host,
            port: parseInt(port, 10),
            database,
            username,
            password,
            ssl: false,
            color: colorOptions[0],
          });
        }
      } catch (error) {
        console.log("Clipboard read error:", error);
        return;
      }
    })();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <IconDatabase className="w-4 h-4 text-blue" />
            <h2 className="text-text-primary font-medium text-sm">
              Add New Server
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-text-secondary text-xs font-medium">
              Server Name
            </p>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="My PostgreSQL Server"
              className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-text-secondary text-xs font-medium">Host</p>
              <input
                value={formData.host}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, host: e.target.value }))
                }
                placeholder="localhost"
                className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
              />
            </div>
            <div>
              <p className="text-text-secondary text-xs font-medium">Port</p>
              <input
                type="number"
                value={formData.port}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    port: Number.parseInt(e.target.value),
                  }))
                }
                className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
              />
            </div>
          </div>

          <div>
            <p className="text-text-secondary text-xs font-medium">Database</p>
            <input
              value={formData.database}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, database: e.target.value }))
              }
              placeholder="database_name"
              className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            />
          </div>

          <div>
            <p className="text-text-secondary text-xs font-medium">Username</p>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="username"
              className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            />
          </div>

          <div>
            <p className="text-text-secondary text-xs font-medium">Password</p>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="password"
              className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            />
          </div>

          <div>
            <p className="text-text-secondary text-xs font-medium">Color</p>
            <div className="flex gap-1 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-5 h-5 rounded-full border ${
                    formData.color === color
                      ? "border-text-primary border-2"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <Button onClick={onClose}>
            <p className="text-sm">Cancel</p>
          </Button>
          <Button onClick={handleSave}>
            <p className="text-sm">Add Server</p>
          </Button>
        </div>
      </div>
    </div>
  );
};
