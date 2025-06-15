import "./App.css";

import { Outlet, Route, Routes } from "react-router";
import { Dashboard, Home } from "./pages";
import { PasswordProvider, StrongholdProvider } from "./context";

const MasterLayout = () => {
  return (
    <PasswordProvider>
      <StrongholdProvider>
        <Outlet />
      </StrongholdProvider>
    </PasswordProvider>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        <Route index element={<Home />} />
        <Route path="/dashboard/:serverId/:url" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
