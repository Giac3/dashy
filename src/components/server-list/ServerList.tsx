import { IconClock, IconDatabase } from "@tabler/icons-react";
import type { TServer } from "../../types";

interface ServerListProps {
  servers: TServer[];
  selectedServer?: TServer | null;
  onServerSelect: (server: TServer) => void;
  searchQuery: string;
}

export const ServerList = ({
  servers,
  selectedServer,
  onServerSelect,
  searchQuery,
}: ServerListProps) => {
  const filteredServers = servers.filter(
    (server) =>
      (server.name || "Unnamed Server")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      server.host?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (servers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <IconDatabase className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No servers configured
          </h3>
          <p className="text-text-secondary mb-6 max-w-md">
            Get started by adding your first PostgreSQL server connection. You
            can manage multiple database connections from here.
          </p>
        </div>
      </div>
    );
  }

  if (filteredServers.length === 0 && searchQuery) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
            <IconDatabase className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No servers found
          </h3>
          <p className="text-text-secondary">
            No servers match your search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-2">
        {filteredServers.map((server) => (
          <div
            key={server.id}
            onClick={() => onServerSelect(server)}
            className={`border rounded-lg p-2 cursor-pointer transition-all group overflow-hidden ${
              selectedServer?.id === server.id
                ? "bg-surface border-border shadow-sm"
                : "bg-secondary border-transparent hover:bg-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: server.color || "#424242" }}
              >
                <IconDatabase className="w-4 h-4 text-text-primary" />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-medium transition-colors text-sm text-text-primary whitespace-nowrap`}
                >
                  {server.name || "Unnamed Server"}
                </h3>
                <div className="flex items-center gap-4 text-text-secondary mt-1 text-xs whitespace-nowrap">
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
        ))}
      </div>
    </div>
  );
};
