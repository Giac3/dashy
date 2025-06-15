import {
  IconAlertTriangle,
  IconCircle,
  IconClock,
  IconDatabase,
} from "@tabler/icons-react";
import type { TServer } from "../../types";

interface ServerCardProps {
  server: TServer;
  onClick: () => void;
}

export const ServerCard = ({ server, onClick }: ServerCardProps) => {
  const getStatusColor = (status?: TServer["status"]) => {
    switch (status) {
      case "connected":
        return "text-green";
      case "testing":
        return "text-yellow";
      case "error":
        return "text-red";
      default:
        return "text-text-muted";
    }
  };

  const getStatusIcon = (status?: TServer["status"]) => {
    switch (status) {
      case "connected":
        return <IconCircle className="w-3 h-3 fill-current" />;
      case "testing":
        return <IconCircle className="w-3 h-3 fill-current animate-pulse" />;
      case "error":
        return <IconAlertTriangle className="w-3 h-3" />;
      default:
        return <IconCircle className="w-3 h-3" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:bg-hover transition-colors cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: server.color || "#424242" }}
          >
            <IconDatabase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-text-primary font-medium group-hover:text-blue transition-colors">
              {server.name || "Unnamed Server"}
            </h3>
            <p className="text-text-muted text-sm">
              {server.host}:{server.port}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 ${getStatusColor(server.status)}`}
        >
          {getStatusIcon(server.status)}
          <span className="text-xs capitalize">
            {server.status || "disconnected"}
          </span>
        </div>
      </div>

      <div className="space-y-1 text-sm text-text-secondary">
        <div>Database: {server.database}</div>
        <div>User: {server.username}</div>
        {server.lastConnected && (
          <div className="flex items-center gap-1 text-text-muted">
            <IconClock className="w-3 h-3" />
            Last connected: {server.lastConnected.toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};
