import { useState, useEffect } from "react";
import type { TServer } from "../../types";
import { IconDatabase, IconX } from "@tabler/icons-react";
import { Button } from "../button";
interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (server: Omit<TServer, "id">) => void;
}

const colorOptions = [
  "#ff5252",
  "#4cff4c",
  "#00b8ff",
  "#bf5aff",
  "#ff49db",
  "#ffdd00",
  "#ff8c00",
  "#00e5c7",
];

export const ServerModal = ({ isOpen, onClose, onSave }: ServerModalProps) => {
  const [formData, setFormData] = useState<Partial<TServer>>({
    name: "",
    host: "localhost",
    port: 5432,
    database: "",
    username: "",
    password: "",
    ssl: false,
    color: colorOptions[0],
  });

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  const handleSave = () => {
    const url = `postgresql://${formData.username}:${formData.password}@${formData.host}:${formData.port}/${formData.database}`;
    onSave({
      ...formData,
      url,
    } as Omit<TServer, "id">);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <IconDatabase className="w-5 h-5 text-blue" />
            <h2 className="text-text-primary font-semibold">Add Server</h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-text-secondary">Server Name</p>
            <input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="My PostgreSQL Server"
              className="bg-surface border-border text-text-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-text-secondary">Host</p>
              <input
                id="host"
                value={formData.host || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, host: e.target.value }))
                }
                placeholder="localhost"
                className="bg-surface border-border text-text-primary"
              />
            </div>
            <div>
              <p className="text-text-secondary">Port</p>
              <input
                id="port"
                type="number"
                value={formData.port || 5432}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    port: Number.parseInt(e.target.value),
                  }))
                }
                className="bg-surface border-border text-text-primary"
              />
            </div>
          </div>

          <div>
            <p className="text-text-secondary">Database</p>
            <input
              id="database"
              value={formData.database || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, database: e.target.value }))
              }
              placeholder="mydb"
              className="bg-surface border-border text-text-primary"
            />
          </div>

          <div>
            <p className="text-text-secondary">Username</p>
            <input
              id="username"
              value={formData.username || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="postgres"
              className="bg-surface border-border text-text-primary"
            />
          </div>

          <div>
            <p className="text-text-secondary">Password</p>
            <input
              id="password"
              type="password"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="bg-surface border-border text-text-primary"
            />
          </div>

          <div>
            <p className="text-text-secondary">Color</p>
            <div className="flex gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color
                      ? "border-text-primary"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-border">
          <div className="flex gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Add Server</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
