// Página principal de robots asignados
// Acá se muestra la lista de robots asignados, debe permitir filtrarlos
// Agregar botón para crear un nuevo robot asignado (via modal)

import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables";
import robots from "../../mockups/robots.json"; // Archivo JSON simulado con datos de robots asignados

export const RobotsAsignados = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Inicial
  const tableRef = useRef(null);

  useEffect(() => {
    const updateRowsPerPage = () => {
      if (tableRef.current) {
        const offsetTop = tableRef.current.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - offsetTop - 120; // margen para botones y paddings
        const rowHeight = 60; // ajusta a tu diseño real
        const possibleRows = Math.floor(availableHeight / rowHeight);
        setRowsPerPage(possibleRows > 0 ? possibleRows : 1);
      }
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  const totalPages = Math.ceil(robots.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleRobots = robots.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <h1>Robots Asignados</h1>
      <div className="table-container" ref={tableRef}>
        <Tables
          header={
            <>
              <th>ID Robot</th>
              <th>Lugar de Trabajo</th>
              <th>Estado</th>
            </>
          }
          main={
            visibleRobots.map((robot) => (
              <tr key={robot.id_robot}>
                <td>{robot.id_robot}</td>
                <td>{robot.lugar_trabajo}</td>
                <td>{robot.estado}</td>
              </tr>
            ))
          }
        />

        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="link-button"
          >
            Anterior
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="link-button"
          >
            Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default RobotsAsignados;