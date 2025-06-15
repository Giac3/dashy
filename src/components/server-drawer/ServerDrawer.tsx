import { useState, useEffect } from "react";
import type { TServer } from "../../types";

import { Button } from "../button";
import {
  IconDatabase,
  IconExternalLink,
  IconLoader2,
  IconTestPipe,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

interface ServerDrawerProps {
  server?: TServer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (server: Omit<TServer, "id"> | TServer) => void;
  onDelete?: (id: string) => void;
  onTest?: (server: TServer) => Promise<boolean>;
  onConnect?: (server: TServer) => void;
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

export const ServerDrawer = ({
  server,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onTest,
  onConnect,
}: ServerDrawerProps) => {
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(
    null
  );

  useEffect(() => {
    if (server) {
      setFormData(server);
      setTestResult(null);
    } else {
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
      setTestResult(null);
    }
  }, [server]);

  const handleSave = () => {
    const url = `postgresql://${formData.username}:${formData.password}@${formData.host}:${formData.port}/${formData.database}`;
    onSave({
      ...formData,
      url,
    } as TServer);
    onClose();
  };

  const handleTest = async () => {
    if (!server || !onTest) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const success = await onTest(server);
      setTestResult(success ? "success" : "error");
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = () => {
    if (server && onDelete) {
      onDelete(server.id);
      onClose();
    }
  };

  const handleConnect = () => {
    if (server && onConnect) {
      onConnect(server);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-secondary border-l border-border w-96 h-full overflow-y-auto flex-shrink-0 animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-secondary z-10">
        <div className="flex items-center gap-2">
          <IconDatabase className="w-5 h-5 text-blue" />
          <h2 className="text-text-primary font-semibold">
            {server ? "Edit Server" : "Add Server"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <IconX className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {server && onConnect && (
          <Button onClick={handleConnect}>
            <IconExternalLink className="w-4 h-4 mr-2" />
            Connect to Server
          </Button>
        )}

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

        {server && onTest && (
          <div>
            <Button onClick={handleTest} disabled={isTesting}>
              {isTesting ? (
                <IconLoader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <IconTestPipe className="w-4 h-4 mr-2" />
              )}
              Test Connection
            </Button>
            {testResult && (
              <div
                className={`mt-2 p-2 rounded text-sm ${
                  testResult === "success"
                    ? "bg-green/10 text-green"
                    : "bg-red/10 text-red"
                }`}
              >
                {testResult === "success"
                  ? "Connection successful! Database is reachable."
                  : "Connection failed. Please check your settings."}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 border-t border-border sticky bottom-0 bg-secondary">
        <div>
          {server && onDelete && (
            <Button onClick={() => setShowDeleteConfirm(true)}>
              <IconTrash className="w-4 h-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            {server ? "Update" : "Add"} Server
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-text-primary font-semibold mb-2">
              Delete Server
            </h3>
            <p className="text-text-secondary mb-4">
              Are you sure you want to delete "{server?.name}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
