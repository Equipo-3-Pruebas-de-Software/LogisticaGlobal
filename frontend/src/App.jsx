import { Routes, Route } from "react-router-dom";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css

import Login from "./pages/login";
import PrivateRoute from "./pages/privateroute"
import AccessDenied from "./pages/accesoDenegado";
import NotFound from "./pages/notfound"

import SupervisorLayout from "./pages/supervisor/supervisorlayout";
import SupervisorDashboard from "./pages/supervisor/dashboard";
import Incidentes from "./pages/supervisor/incidentes";
import RobotsSupervisor from "./pages/supervisor/robots";
import TecnicosSupervisor from "./pages/supervisor/tecnicos";

import TecnicoLayout from "./pages/tecnico/tecnicolayout";
import RobotsAsignados from "./pages/tecnico/robots_asignados";

import JefeDeTurnoLayout from "./pages/jefe_de_turno/jefedeturnolayout";
import JefeDeTurno from "./pages/jefe_de_turno/Dashboard";

import AdministradorLayout from "./pages/administrador/administradorlayout";
import AgregarFuncionario from "./pages/administrador/crear";
import SupervisorAdmin from "./pages/administrador/supervisor"
import RobotAdmin from "./pages/administrador/robot"
import TecnicoAdmin from "./pages/administrador/tecnico"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      
      <Route element={<PrivateRoute allowedRoles={['supervisor']} />}>
        {/* Supervisor */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="incidentes" element={<Incidentes />} />
          <Route path="robots" element={<RobotsSupervisor />} />
          <Route path="tecnicos" element={<TecnicosSupervisor />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['tecnico']} />}>
        {/* Técnico */}
        <Route path="/tecnico" element={<TecnicoLayout />}>
          <Route index element={<RobotsAsignados />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['jefe_turno']} />}>
        {/* Jefe de Turno */}
        <Route path="/jefe_turno" element={<JefeDeTurnoLayout />}>
          <Route index element={<JefeDeTurno />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdministradorLayout />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="crear" element={<AgregarFuncionario  />} />
          <Route path="supervisor" element={<SupervisorAdmin />} />
          <Route path="robot" element={<RobotAdmin />} />
          <Route path="tecnico" element={<TecnicoAdmin />} />
          <Route path="jefe-turno" element={<TecnicoAdmin />} />
        </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
