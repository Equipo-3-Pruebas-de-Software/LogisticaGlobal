import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import SupervisorLayout from "./pages/supervisor/supervisorlayout";
import SupervisorDashboard from "./pages/supervisor/dashboard";
import Incidentes from "./pages/supervisor/incidentes";
import RobotsSupervisor from "./pages/supervisor/robots";
import TecnicosSupervisor from "./pages/supervisor/tecnicos";

import TecnicoLayout from "./pages/tecnico/tecnicolayout";
import RobotsAsignados from "./pages/tecnico/robots_asignados";

import JefeDeTurnoLayout from "./pages/jefe_de_turno/jefedeturnolayout";
import JefeDeTurno from "./pages/jefe_de_turno/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Supervisor */}
      <Route path="/supervisor" element={<SupervisorLayout />}>
        <Route index element={<SupervisorDashboard />} />
        <Route path="incidentes" element={<Incidentes />} />
        <Route path="robots" element={<RobotsSupervisor />} />
        <Route path="tecnicos" element={<TecnicosSupervisor />} />
      </Route>

      {/* Técnico */}
      <Route path="/tecnico" element={<TecnicoLayout />}>
        <Route index element={<RobotsAsignados />} />
      </Route>

      {/* Jefe de Turno */}
      <Route path="/jefe_turno" element={<JefeDeTurnoLayout />}>
        <Route index element={<JefeDeTurno />} />
      </Route>
    </Routes>
  );
}

export default App;
