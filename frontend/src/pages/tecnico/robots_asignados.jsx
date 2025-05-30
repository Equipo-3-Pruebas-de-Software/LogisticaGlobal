import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import '../../stylesheets/tecnico/robots_asignados.css';

const RobotsAsignados = () => {
  const [robots, setRobots] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [robotSeleccionado, setRobotSeleccionado] = useState(null);
  const [comentario, setComentario] = useState('');
  const { usuario } = useUser();

  useEffect(() => {
    if (!usuario) return;

    const fetchRobots = async () => {
      try {
        const response = await fetch(`http://18.217.42.134:3000/tecnicos/robots-asignados/${usuario.rut}`);
        const data = await response.json();
        setRobots(data);
      } catch (err) {
        console.error('Error al obtener los robots:', err);
      }
    };

    fetchRobots();
  }, [usuario, modalVisible]);

  const abrirModal = (robot) => {
    setRobotSeleccionado(robot);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setRobotSeleccionado(null);
    setComentario('');
  };
  
  const finalizarReparacion = async () => {
    try {
      const response = await fetch('/incidentes-robots-tecnicos/subir-ficha', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_incidente: robotSeleccionado.id_incidentes,
          id_robot: robotSeleccionado.id_robot,
          descripcion: comentario
        }),
      });

      if (!response.ok) throw new Error('No se pudo cerrar la reparación');

      // Refrescar lista
      const nuevaLista = robots.filter(r => r.id_robot !== robotSeleccionado.id_robot);
      setRobots(nuevaLista);
      cerrarModal();
    } catch (err) {
      console.error('Error al finalizar reparación:', err);
    }
  };

  return (
    <div>
      <h1>Robots Asignados</h1>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Lugar de Trabajo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {robots.map((robot) => (
              <tr key={robot.id_robot}>
                <td>{robot.id_robot}</td>
                <td>{robot.lugar_trabajo}</td>
                <td>{robot.estado}</td>
                <td>
                  <button className="close-repair-button" onClick={() => abrirModal(robot)}>
                    Cerrar Reparación
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Finalizar reparación</h3>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Describe lo realizado..."
              rows={4}
            />
            <div className="modal-actions">
              <button className="modal-button confirm" onClick={finalizarReparacion}>Enviar</button>
              <button className="modal-button cancel" onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RobotsAsignados;
