import { IconDatabase, IconSearch } from "@tabler/icons-react";
import { Button } from "../button";

interface ServerSidebarProps {
  onNewServer: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ServerSidebar = ({
  onNewServer,
  searchQuery,
  onSearchChange,
}: ServerSidebarProps) => {
  return (
    <div className="min-w-[200px]  bg-secondary border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-text-primary font-medium text-sm">Servers</h2>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-4">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            placeholder="Filter Servers"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-surface  text-text-primary text-sm h-8 w-full rounded-md outline-none border-border border-[1px]"
          />
        </div>
        <Button onClick={onNewServer}>
          <IconDatabase className="w-4 h-4" />
          <p className=" text-sm">New Server</p>
        </Button>
      </div>
    </div>
  );
};
