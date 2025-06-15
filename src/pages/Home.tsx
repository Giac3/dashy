import { useServerManager } from "../hooks";
import { useState } from "react";
import { TServer } from "../types";
import {
  AddServerModal,
  ServerConfigPanel,
  ServerList,
  ServerSidebar,
} from "../components";

const Landing = () => {
  const { servers, removeServer, addServer, updateServer } = useServerManager();
  const [selectedServer, setSelectedServer] = useState<TServer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleServerSelect = (server: TServer) => {
    setSelectedServer(server);
  };

  const handleAddServer = (serverData: TServer) => {
    addServer(serverData);
    setShowAddModal(false);
  };

  const handleUpdateServer = (serverData: TServer) => {
    updateServer(serverData);
  };

  const handleDeleteServer = (id: string) => {
    removeServer(id);
    setSelectedServer(null);
  };

  return (
    <div className="h-screen bg-primary text-text-primary flex">
      {/* Left Sidebar */}
      <ServerSidebar
        onNewServer={() => setShowAddModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area - Server List */}
      <div className="flex-1 bg-primary overflow-y-auto">
        <ServerList
          servers={servers}
          selectedServer={selectedServer}
          onServerSelect={handleServerSelect}
          searchQuery={searchQuery}
        />
      </div>

      {/* Right Configuration Panel */}
      {selectedServer && (
        <ServerConfigPanel
          server={selectedServer}
          isOpen={!!selectedServer}
          onClose={() => setSelectedServer(null)}
          onSave={handleUpdateServer}
          onDelete={handleDeleteServer}
        />
      )}

      {/* Add Server Modal */}
      <AddServerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddServer}
      />
    </div>
  );
};

const Home = () => {
  return <Landing />;
};
export { Home };
