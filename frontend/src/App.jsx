import { Routes, Route } from "react-router";
import Login from "./pages/login";
import SupervisorLayout from "./pages/supervisor/supervisorlayout";
import SupervisorDashboard from "./pages/supervisor/dashboard";
import Incidentes from "./pages/supervisor/incidentes";

import TecnicoLayout from "./pages/tecnico/tecnicolayout";
import TecnicoRobots from "./pages/tecnico/robots_asignados";
import RobotsAsignados from "./pages/tecnico/robots_asignados";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Supervisor */}
      <Route path="/supervisor" element={<SupervisorLayout />}>
        <Route index element={<SupervisorDashboard />} />
        <Route path="incidentes" element={<Incidentes />} />
      </Route>

      {/* Técnico */}
      <Route path="/tecnico" element={<TecnicoLayout />}>
        <Route index element={<TecnicoRobots />} />
        <Route path="/tecnico/robots" element={<RobotsAsignados />} />
      </Route>
    </Routes>
  );
}

export default App;
