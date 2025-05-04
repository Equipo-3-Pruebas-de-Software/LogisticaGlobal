// Página principal de robots asignados
// Acá se muestra la lista de robots asignados, debe permitir filtrarlos
// Agregar botón para crear un nuevo robot asignado (via modal)
import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables";

export const RobotsAsignados = ({ rutTecnico }) => {
  const [robots, setRobots] = useState([]); // Estado para almacenar los robots obtenidos del backend
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const tableRef = useRef(null);

  // Solicitar los robots asignados al técnico al cargar el componente
  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await fetch(`http://localhost:3000/robots-asignados/${rutTecnico}`);
        if (!response.ok) {
          throw new Error("Error al obtener los robots asignados");
        }
        const data = await response.json();
        setRobots(data); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching robots:", error);
      }
    };

    fetchRobots();
  }, [rutTecnico]);

  // Ajustar el número de filas por página según el tamaño de la ventana
  useEffect(() => {
    const updateRowsPerPage = () => {
      if (tableRef.current) {
        const offsetTop = tableRef.current.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - offsetTop - 120; // Ajusta según el diseño
        const rowHeight = 60; // Altura estimada de cada fila
        const possibleRows = Math.floor(availableHeight / rowHeight);
        setRowsPerPage(possibleRows > 0 ? possibleRows : 1);
      }
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  // Paginación
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