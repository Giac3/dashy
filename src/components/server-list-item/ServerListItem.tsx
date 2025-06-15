import { IconClock, IconDatabase } from "@tabler/icons-react";
import type { TServer } from "../../types";

interface ServerListItemProps {
  server: TServer;
  isSelected?: boolean;
  onClick: (server: TServer) => void;
}

export const ServerListItem = ({
  server,
  isSelected,
  onClick,
}: ServerListItemProps) => {
  return (
    <div
      onClick={() => onClick(server)}
      className={`border rounded-lg p-3 transition-all cursor-pointer group flex items-center justify-between ${
        isSelected
          ? "bg-surface border-blue shadow-sm"
          : "bg-card border-border hover:bg-hover hover:border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: server.color || "#424242" }}
        >
          <IconDatabase className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3
            className={`font-medium transition-colors ${
              isSelected
                ? "text-blue"
                : "text-text-primary group-hover:text-blue"
            }`}
          >
            {server.name || "Unnamed Server"}
          </h3>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span>
              {server.host}:{server.port}
            </span>
            <span>DB: {server.database}</span>
            <span>User: {server.username}</span>
            {server.lastConnected && (
              <span className="flex items-center gap-1 text-text-muted">
                <IconClock className="w-3 h-3" />
                {server.lastConnected.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
