import { useState, useEffect , useRef } from 'react';
import { useUser } from '../../context/UserContext';
import '../../stylesheets/tecnico/robots_asignados.css';

import Tables from '../../components/general/tables';
import RobotsAsignadosCards from "../../components/general/tables/[Vista Técnico]/robots-asignados-cards"
import { InputTextarea } from 'primereact/inputtextarea';

const RobotsAsignados = () => {
  const [robots, setRobots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDescripcion, setModalVisibleDescripcion] = useState(false);
  const [comentario, setComentario] = useState('');

  const { usuario } = useUser();
  const tableRef = useRef(null);

  useEffect(() => {
    const updateRowsPerPage = () => {
      if (tableRef.current) {
        const offsetTop = tableRef.current.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - offsetTop - 120;
        const rowHeight = 50;
        const possibleRows = Math.floor(availableHeight / rowHeight);
        setRowsPerPage(possibleRows > 0 ? possibleRows : 1);
      }
    };
    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  useEffect(() => {
      setCurrentPage(1);
    }, []);

  useEffect(() => {
    if (!usuario) return;

    const fetchRobots = async () => {
      try {
        const response = await fetch(`http://192.168.1.88:3000/tecnicos/robots-asignados/${usuario.rut}`);
        const data = await response.json();
        setRobots(data);
      } catch (err) {
        console.error('Error al obtener los robots:', err);
      }
    };

    fetchRobots();
  }, [usuario, comentario]);

  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setComentario('');
  };

  const abrirModalDescripcion = (comentario) => {
    setModalVisibleDescripcion(true);
    setComentario(comentario)
  };

  const cerrarModalDescricion = () => {
    setModalVisibleDescripcion(false);
    setComentario('');
  };

  const actuales = robots?.filter(
    (robot) => robot.estado_incidente !== "resuelto"
  );

  const pasados = robots?.filter(
    (robot) => robot.estado_incidente === "resuelto"
  );

  const totalPages = Math.ceil(pasados?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleIncidentes = pasados?.slice(startIndex, startIndex + rowsPerPage);
  
  const finalizarReparacion = async () => {
    try {
      const response = await fetch('/incidentes-robots-tecnicos/subir-ficha', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_incidente: actuales[0].id_incidente,
          id_robot: actuales[0].id_robot,
          descripcion: comentario
        }),
      });

      if (!response.ok) throw new Error('No se pudo cerrar la reparación');

      cerrarModal();
    } catch (err) {
      console.error('Error al finalizar reparación:', err);
    }
  };

  return (
    <>
      <h1>Robots Asignados</h1>

      <div className="card-container" style={{ marginTop: '20px'}}>  
        {
          actuales?.map((robot) => (
            <RobotsAsignadosCards key={`${robot.id_incidente}-${robot.id_robot}`} robot={robot}
            operaciones={
              robot?.descripcion === null ? 
                    <><button className="close-repair-button" onClick={() => abrirModal()}>
                      Cerrar Reparación
                    </button></>:
                    <><button className="close-repair-button" onClick={() => abrirModalDescripcion(robot.descripcion)}>
                      Ver descripción
                    </button></>
            }/>
          ))
        }
      </div>

      <div className="table-container" style={{ flex: '0'}}>
        <Tables
          header={
            <>
              <th>ID Robot</th>
              <th>ID Incidente</th>
              <th>Lugar de Trabajo</th>
              <th>Estado del Incidente</th>
              <th>Operación</th>
            </>
          }
          main={
            actuales?.map((robot) => (
              <tr key={`${robot.id_incidente}-${robot.id_robot}`}>
                <td>{robot.id_robot}</td>
                <td>{robot.id_incidente}</td>
                <td>{robot.lugar_trabajo}</td>
                <td>{robot.estado_incidente}</td>
                {robot?.descripcion === null ? 
                  <td>
                    <button className="close-repair-button" onClick={() => abrirModal()}>
                      Cerrar Reparación
                    </button>
                  </td> :

                  <td>
                    <button className="close-repair-button" onClick={() => abrirModalDescripcion(robot.descripcion)}>
                      Ver descripción
                    </button>
                  </td>
                }
              </tr>
            ))
          }
        />
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Finalizar reparación</h3>
            <InputTextarea id="comentario" rows={4} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder='Describe lo realizado...'/>
            <div className="modal-actions">
              <button className="modal-button confirm" onClick={finalizarReparacion}>Enviar</button>
              <button className="modal-button cancel" onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modalVisibleDescripcion && (
        <div className="modal">
          <div className="modal-content">
            <h3>Descripción del trabajo realizado: </h3>
            <p style={{ marginBottom: '15px'}}>{comentario}</p>
            <button className="modal-button cancel" onClick={cerrarModalDescricion}>Cerrar</button>
          </div>
        </div>
      )}

      <h1 style={{ marginTop: '20px'}}>Robots Reparados</h1>
      
      <div className="card-container" style={{ marginTop: '20px'}}>  
        {
          pasados?.map((robot) => (
            <RobotsAsignadosCards key={`${robot.id_incidente}-${robot.id_robot}`} robot={robot}
            operaciones={
              robot?.descripcion === null ? 
                    <><button className="close-repair-button" onClick={() => abrirModal()}>
                      Cerrar Reparación
                    </button></>:
                    <><button className="close-repair-button" onClick={() => abrirModalDescripcion(robot.descripcion)}>
                      Ver descripción
                    </button></>
            }/>
          ))
        }
      </div>

      <div className="table-container" ref={tableRef}>
        <Tables
          header={
            <>
              <th>ID Robot</th>
              <th>ID Incidente</th>
              <th>Lugar de Trabajo</th>
              <th>Estado del Incidente</th>
              <th>Operación</th>
            </>
          }
          main={
            visibleIncidentes?.map((robot) => (
              <tr key={`${robot.id_incidente}-${robot.id_robot}`}>
                <td>{robot.id_robot}</td>
                <td>{robot.id_incidente}</td>
                <td>{robot.lugar_trabajo}</td>
                <td>{robot.estado_incidente}</td>
                {robot?.descripcion === null ? 
                  <td>
                    <button className="close-repair-button" onClick={() => abrirModal()}>
                      Cerrar Reparación
                    </button>
                  </td> :

                  <td>
                    <button className="close-repair-button" onClick={() => abrirModalDescripcion(robot.descripcion)}>
                      Ver descripción
                    </button>
                  </td>
                }
              </tr>
            ))
          }
        />

        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="link-button">Anterior</button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="link-button">Siguiente</button>
        </div>

      </div>
    </>
  );
};

export default RobotsAsignados;