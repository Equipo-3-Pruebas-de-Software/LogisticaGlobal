// Página principal de robots asignados
import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables";

export const RobotsAsignados = ({ rutTecnico }) => {
  const [robots, setRobots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const tableRef = useRef(null);

  // NUEVOS estados para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [robotSeleccionado, setRobotSeleccionado] = useState(null);
  const [comentario, setComentario] = useState('');

  // Obtener robots asignados
  useEffect(() => {
    const fetchRobots = async () => {
      console.log("Consultando robots para técnico:", rutTecnico);
      try {
        const response = await fetch(`http://localhost:3000/tecnicos/robots-asignados/${rutTecnico}`);
        if (!response.ok) throw new Error("Error al obtener los robots asignados");
        const data = await response.json();
        console.log("Respuesta del backend:", data);
        setRobots(data);
      } catch (error) {
        console.error("Error fetching robots:", error);
      }
    };

    fetchRobots();
  }, [rutTecnico]);

  // Ajustar altura visible
  useEffect(() => {
    const updateRowsPerPage = () => {
      if (tableRef.current) {
        const offsetTop = tableRef.current.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - offsetTop - 120;
        const rowHeight = 60;
        const possibleRows = Math.floor(availableHeight / rowHeight);
        setRowsPerPage(possibleRows > 0 ? possibleRows : 1);
      }
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  // Funciones para el modal
  const abrirModal = (robot) => {
    setRobotSeleccionado(robot);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setRobotSeleccionado(null);
    setComentario('');
    setModalVisible(false);
  };

  const enviarComentario = async () => {
    if (!comentario || !robotSeleccionado) return;

    try {
      const response = await fetch(`http://localhost:3000/robots/finalizar-reparacion`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_robot: robotSeleccionado.id_robot,
          id_incidente: robotSeleccionado.id_incidentes,
          comentario: comentario
        })
      });

      if (!response.ok) throw new Error('Error al enviar comentario');
      cerrarModal();
      window.location.reload(); // o volver a llamar fetchRobots()
    } catch (error) {
      console.error('Error:', error);
    }
    
  };

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
              <th>Acciones</th>
            </>
          }
          main={
            visibleRobots.map((robot) => (
              <tr key={robot.id_robot}>
                <td>{robot.id_robot}</td>
                <td>{robot.lugar_trabajo}</td>
                <td>{robot.estado}</td>
                <td>
                  <button onClick={() => abrirModal(robot)}>Finalizar</button>
                </td>
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

      {/* Modal */}
      {modalVisible && (
        <div className="modal">
          <h3>Finalizar reparación</h3>
          <p>Robot: {robotSeleccionado?.id_robot}</p>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Describe lo realizado..."
            rows={4}
            cols={40}
          />
          <br />
          <button onClick={enviarComentario}>Enviar</button>
          <button onClick={cerrarModal}>Cancelar</button>
        </div>
      )}
    </>
  );
};

export default RobotsAsignados;
