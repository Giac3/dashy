import { useState, useEffect } from "react";
import type { TServer } from "../../types";

import { Button } from "../button";
import {
  IconDatabase,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconTestPipe,
  IconTrash,
  IconX,
  IconCircleCheckFilled,
  IconAlertTriangleFilled,
} from "@tabler/icons-react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router";

interface ServerConfigPanelProps {
  server?: TServer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (server: TServer) => void;
  onDelete?: (id: string) => void;
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

type TTestResult =
  | "success"
  | {
      type: "error";
      message: string;
    };

export const ServerConfigPanel = ({
  server,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: ServerConfigPanelProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<TServer>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [testResult, setTestResult] = useState<TTestResult | null>(null);

  useEffect(() => {
    if (server) {
      setFormData(server);
      setTestResult(null);
    }
  }, [server]);

  useEffect(() => {
    const url = `postgresql://${formData.username}:${formData.password}@${formData.host}:${formData.port}/${formData.database}`;
    onSave({
      ...server,
      ...formData,
      url,
    } as TServer);
  }, [formData]);

  const handleTest = async () => {
    if (!server) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      await invoke("connect", { url: server.url });
      setTestResult("success");
    } catch (error) {
      setTestResult({
        type: "error",
        message: String(error),
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen || !server) return null;

  return (
    <div className="w-80 bg-secondary border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{ backgroundColor: server.color || "#424242" }}
          >
            <IconDatabase className="w-3 h-3 text-text-primary" />
          </div>
          <span className="text-text-primary font-medium text-sm">
            Server Configuration
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-text-secondary text-xs font-medium">Nickname</p>
          <input
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Server nickname"
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
        <div>
          <p className="text-text-secondary text-xs font-medium">Host</p>
          <input
            value={formData.host || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, host: e.target.value }))
            }
            placeholder="localhost"
            className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-text-secondary text-xs font-medium">Database</p>
            <input
              value={formData.database || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, database: e.target.value }))
              }
              placeholder="database_name"
              className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            />
          </div>
          <div>
            <p className="text-text-secondary text-xs font-medium">Port</p>
            <input
              type="number"
              value={formData.port || 5432}
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
          <p className="text-text-secondary text-xs font-medium">User</p>
          <input
            value={formData.username || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder="username"
            className="p-2 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
          />
        </div>

        <div>
          <p className="text-text-secondary text-xs font-medium">Password</p>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="password"
              className="p-2 pr-6 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? (
                <IconEyeOff className="w-3 h-3" />
              ) : (
                <IconEye className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex p-4">
        {onDelete && (
          <>
            {confirmDelete ? (
              <div className="flex items-center gap-2 w-full">
                <Button onClick={() => setConfirmDelete(false)}>
                  <p className="text-sm">Cancel</p>
                </Button>
                <Button
                  onClick={() => {
                    onDelete(server.id);
                    setConfirmDelete(false);
                  }}
                >
                  <p className="text-sm">Confirm</p>
                </Button>
              </div>
            ) : (
              <Button onClick={() => setConfirmDelete(true)}>
                <IconTrash className="w-4 h-4 mr-1" />
                <p className="text-sm">Delete Server</p>
              </Button>
            )}
          </>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-3 gap-2">
          <Button onClick={handleTest} disabled={isTesting}>
            {isTesting ? (
              <IconLoader2 className="w-4 h-4 animate-spin mr-1" />
            ) : testResult === "success" ? (
              <IconCircleCheckFilled className="w-4 h-4 text-green mr-1" />
            ) : testResult?.type === "error" ? (
              <IconAlertTriangleFilled className="w-4 h-4 text-yellow mr-1" />
            ) : (
              <IconTestPipe className="w-4 h-4 mr-1" />
            )}
            <p className="text-sm">Test</p>
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigate(
                `/dashboard/${server.id}/${encodeURIComponent(server.url)}`
              )
            }
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
};
