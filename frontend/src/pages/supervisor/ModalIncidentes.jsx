import { useState , useEffect} from 'react';

import { Timeline } from 'primereact/timeline';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { formatFecha } from "../../utils/date";
import { Message } from 'primereact/message';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export const ModalIncidentes = ({onClose, incidente}) => {

    const [prioridad, setPrioridad] = useState(incidente.prioridad || null);
    const [gravedad, setGravedad] = useState(incidente.gravedad || null);
    const [tecnicos, setTecnicos] = useState([]);
    const [detalles, setDetalles] = useState(null);
    const [asignaciones, setAsignaciones] = useState({});
    const [mensaje, setMensaje] = useState(null);

    const idsRobot = detalles?.map(detalle => detalle.id_robot);
    const rutTenicos = detalles?.map(detalle => detalle.rut_tecnico);

    const gravedades = ['Alta', 'Media', 'Baja'];
    const events = [
        { status: 'Creado', date: formatFecha(incidente.fecha_creado)},
        { status: 'Técnico asignado', date: formatFecha(incidente.fecha_tecnico_asignado)},
        { status: 'En espera de aprobación', date: formatFecha(incidente.fecha_espera_aprovacion)},
        { status: 'Resuelto', date: formatFecha(incidente.fecha_resuelto)}
    ];

    const supervisor = "12345677-9"
    
    useEffect(() => {
        setAsignaciones({});
        fetch(`/incidentes/${incidente.id_incidentes}`) 
          .then((response) => {
            if (!response.ok) throw new Error('Error al obtener incidentes');
            return response.json();
          })
          .then((data) => {
            setDetalles(data.detalles); 
          })
          .catch((error) => {
            console.error('[ERROR FETCH INCIDENTES]', error);
          });
      }, [incidente.id_incidentes, mensaje]);

      useEffect(() => {
        fetch('/tecnicos') 
          .then((res) => {
            if (!res.ok) throw new Error('Error al obtener técnicos');
            return res.json();
          })
          .then((data) => {
            const opciones = data.map(t => ({ label: t.nombre, value: t.rut }));
            setTecnicos(opciones);
          })
          .catch((err) => console.error('[ERROR FETCH TÉCNICOS]', err));
    }, []);

    const asignarTecnico = (robotId, rutTecnico) => {
        setAsignaciones(prev => ({
          ...prev,
          [robotId]: rutTecnico
        }));
      };
      
      const handleGuardar = async () => {
        try {
          // Validaciones iniciales
          if (!prioridad || !gravedad || !supervisor) {
            throw new Error('Faltan campos obligatorios');
          }
      
          if (Object.keys(asignaciones).length !== idsRobot.length) {
            throw new Error('Todos los robots deben tener un técnico asignado');
          }
      
          // PATCH para actualizar el incidente
          const patchIncidente = await fetch(`/incidentes`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_incidente: incidente.id_incidentes,
              supervisor_asignado: supervisor,
              prioridad,
              gravedad
            })
          });
      
          if (!patchIncidente.ok) {
            throw new Error('Error al actualizar incidente');
          }
      
          // PATCHs para asignar técnicos
          for (const [id_robot, rut_tecnico] of Object.entries(asignaciones)) {
            const res = await fetch('/incidentes-robots-tecnicos/asignar-tecnico', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id_incidente: incidente.id_incidentes,
                id_robot: id_robot,
                rut_tecnico: rut_tecnico
              })
            });
      
            if (!res.ok) {
              throw new Error(`Error al asignar técnico al robot ${id_robot}`);
            }
          }
      
          setMensaje({ type: 'success', text: `Incidente actualizado correctamente` });
          setTimeout(() => {
            onClose();
          }, 1500);
      
        } catch (error) {
          console.error('[ERROR PATCH]', error);
          setMensaje({ type: 'error', text: error.message || 'No se pudieron guardar los cambios' });
        }
      };  
      
      const tecnicosDisponiblesPara = (robotId) => {
        const tecnicoActual = asignaciones[robotId];
        const tecnicosSeleccionados = Object.entries(asignaciones)
          .filter(([id]) => id !== robotId)
          .map(([, rut]) => rut);
      
        return tecnicos.filter(t => t.value === tecnicoActual || !tecnicosSeleccionados.includes(t.value));
      };

    return (
      <div className="modal-overlay">
        <div className="modal-incidentes">
            <section className='info-zone'>
                <div className='container-info'>
                {incidente.gravedad && 
                  <>
                    <h2>Incidente {incidente.id_incidentes}</h2>
                    <h3>Detalles del incidente</h3>
                    <ul>
                        <li><b>Lugar: </b><span>{incidente.lugar}</span></li>
                        <li><b>Descripción: </b><span>{incidente.descripcion}</span></li>
                        <li><b>Prioridad: </b><span>{incidente.prioridad}</span></li>
                        <li><b>Gravedad: </b><span>{incidente.gravedad}</span></li>
                        {incidente.fecha_espera_aprovacion && (
                          <li>
                            <b>Comentarios sobre el trabajo realizado: </b>
                            <span>{incidente.comentario}</span>
                          </li>
                        )}
                    </ul>

                    <h3>Relación Robot - Técnico Asignado</h3>

                    <DataTable value={
                      Array.isArray(idsRobot) && Array.isArray(rutTenicos)
                        ? idsRobot.map((id, index) => ({
                            robot: `Robot ${id}`,
                            tecnico: rutTenicos[index] ?? 'Sin asignar'
                          }))
                        : []
                    }>
                      <Column field="robot" header="Robot" />
                      <Column field="tecnico" header="Técnico Asignado" />
                    </DataTable>
                  </>
                }


                    {!incidente.gravedad &&
                        <>
                            <h2>Incidente {incidente.id_incidentes}</h2>
                            <h3>Detalles del incidente</h3>
                            <ul>
                                <li><b>Lugar:</b> <span>{incidente.lugar}</span></li>
                                <li><b>Descripción:</b> <span>{incidente.descripcion}</span></li>
                            </ul>

                            <h3 className='h3-margin'>Definir Prioridad</h3>
                            <InputNumber id="prioridad" value={prioridad} onValueChange={(e) => setPrioridad(e.value)} style={{ width: '100%' , position: "relative" , zIndex: "999" }}/>
                            
                            <h3 className='h3-margin'>Definir Gravedad</h3>
                            <Dropdown
                                id="gravedad"
                                value={gravedad} 
                                options={gravedades} 
                                onChange={(e) => setGravedad(e.value)} 
                                placeholder="Selecciona gravedad"
                                style={{ width: '100%' , position: "relative" , zIndex: "999" }}

                            />

                            <h3 className='h3-margin'>Asignar Técnico por Robot</h3>
                            {idsRobot?.map((robotId, index) => (
                                <div key={index} className='robot-container'>
                                    <h4>Robot {robotId}</h4>
                                    <Dropdown
                                        style={{ width: '100%' , position: "relative" , zIndex: "999" }}
                                        id={`robot-${robotId}`}
                                        options={tecnicosDisponiblesPara(robotId)} // filtra los técnicos disponibles
                                        onChange={(e) => asignarTecnico(robotId, e.value)}
                                        placeholder="Selecciona técnico"
                                        value={asignaciones[robotId] || null}
                                    />

                                </div>
                            ))}

                            <div className='button-container'>
                                <button className='link-button' onClick={handleGuardar}>Guardar</button>
                                {mensaje && (
                                  <Message severity={mensaje.type} text={mensaje.text} className='msg' style={{ width: '100%' , position: "relative" , zIndex: "999" }}/>
                                )}
                            </div>

                            </>
                    }
                </div>
                <button className="btn-icon" onClick={() => onClose()}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                </button>
            </section>

            <section className='timeline-zone'>
            <Timeline
                value={events}
                opposite={(item) => item.status}
                marker={(item) => (
                    <span
                    style={{
                        backgroundColor: item.date ? '#5C90C5' : '#B0B0B0', // azul o gris
                        width: '1rem',
                        height: '1rem',
                        display: 'inline-block',
                        borderRadius: '50%',
                    }}
                    />
                )}
                content={(item) => (
                    <small style={{ color: item.date ? 'inherit' : '#B0B0B0' }}>
                    {item.date ?? ''}
                    </small>
                )}
                />
            </section>

        </div>
      </div>
    )
  }
  
  export default ModalIncidentes;