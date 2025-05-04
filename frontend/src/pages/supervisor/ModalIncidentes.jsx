import { useState , useEffect} from 'react';

import { Timeline } from 'primereact/timeline';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { formatFecha } from "../../utils/date";

export const ModalIncidentes = ({onClose, incidente}) => {

    const [prioridad, setPrioridad] = useState(incidente.prioridad || null);
    const [gravedad, setGravedad] = useState(incidente.gravedad || null);
    const [tecnicos, setTecnicos] = useState([]);
    const [detalles, setDetalles] = useState(null);
    const [asignaciones, setAsignaciones] = useState({});
    
    useEffect(() => {
        setAsignaciones({});
        fetch(`/incidentes/${incidente.id_incidentes}`) // Reemplaza con tu endpoint real	
          .then((response) => {
            if (!response.ok) throw new Error('Error al obtener incidentes');
            return response.json();
          })
          .then((data) => {
            setDetalles(data.detalles); // asumiendo que el JSON tiene { incidentes: [...] }
          })
          .catch((error) => {
            console.error('[ERROR FETCH INCIDENTES]', error);
          });
      }, [incidente.id_incidentes]);

      useEffect(() => {
        fetch('/tecnicos') // Reemplaza con tu endpoint real
          .then((res) => {
            if (!res.ok) throw new Error('Error al obtener técnicos');
            return res.json();
          })
          .then((data) => {
            // Transforma los técnicos al formato que necesita PrimeReact
            const opciones = data.map(t => ({ label: t.nombre, value: t.rut }));
            setTecnicos(opciones);
          })
          .catch((err) => console.error('[ERROR FETCH TÉCNICOS]', err));
    }, []);
    
    
    const idsRobot = detalles?.map(detalle => detalle.id_robot);
    const gravedades = ['Alta', 'Media', 'Baja'];

    const events = [
        { status: 'Creado', date: formatFecha(incidente.fecha_creado)},
        { status: 'Técnico asignado', date: formatFecha(incidente.fecha_tecnico_asignado)},
        { status: 'En espera de aprobación', date: formatFecha(incidente.fecha_espera_aprovacion)},
        { status: 'Resuelto', date: formatFecha(incidente.fecha_resuelto)}
    ];

    const asignarTecnico = (robotId, rutTecnico) => {
        setAsignaciones(prev => ({
          ...prev,
          [robotId]: rutTecnico
        }));
      };
      
      const supervisor = "11223344-5"

      const handleGuardar = async () => {

        try {
          const body = {
            id_incidente: incidente.id_incidentes,
            supervisor_asignado: supervisor, // usa el RUT actual o cámbialo si es necesario
            prioridad: prioridad,
            gravedad: gravedad
          };
      
          const response = await fetch(`/incidentes`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });
      
          if (!response.ok) {
            throw new Error('Error al guardar los cambios del incidente');
          }
      
          alert('Cambios guardados correctamente');
          onClose(); // Opcional: cerrar modal después de guardar
          window.location.reload(); // Recargar la página para ver los cambios
        } catch (error) {
          console.error('[ERROR PATCH INCIDENTE]', error);
          alert('Error al guardar los cambios');
        }
      };
      
          
    return (
      <div className="modal-overlay">
        <div className="modal">
            <section className='info-zone'>
                <div>
                {incidente.gravedad && 
                        <>
                        <h2>Incidente {incidente.id_incidentes}</h2>
                        <h3>Detalles del incidente</h3>
                        <ul>
                            <li><b>Lugar: </b><span>{incidente.lugar}</span></li>
                            <li><b>Descripción: </b><span>{incidente.descripcion}</span></li>
                            <li>
                              <b>Robot(s) involucrado(s): </b>
                              <span>
                                {Array.isArray(idsRobot)
                                  ? idsRobot
                                      .map(robotId => `Robot ${robotId}`)
                                      .join(', ')
                                  : idsRobot
                                }
                              </span>
                            </li>
                            <li><b>Prioridad: </b><span>{incidente.prioridad}</span></li>
                            <li><b>Gravedad: </b><span>{incidente.gravedad}</span></li>
                            <li><b>Técnico Asignado: </b><span>{incidente.tecnico}</span></li>

                            {incidente.fecha_espera_aprovacion && <li><b>Comentarios sobre el trabajo realizado: </b><span>{incidente.comentario}</span></li>}
                        </ul>
                        {/*
                        <div className='button-container'>
                            <button className='link-button' onClick={handleGuardar}>Editar</button>
                        </div>
                        */}
                        </>
                    }

                    {!incidente.gravedad &&
                        <>
                            <h2>Incidente {incidente.id}</h2>
                            <h3>Detalles del incidente</h3>
                            <ul>
                                <li><b>Lugar:</b> <span>{incidente.lugar}</span></li>
                                <li><b>Descripción:</b> <span>{incidente.descripcion}</span></li>
                            </ul>

                            <h3>Definir Prioridad</h3>
                            <InputNumber value={prioridad} onValueChange={(e) => setPrioridad(e.value)} style={{ width: '100%' }}/>
                            
                            <h3>Definir Gravedad</h3>
                            <Dropdown value={gravedad} 
                                options={gravedades} 
                                onChange={(e) => setGravedad(e.value)} 
                                placeholder="Selecciona gravedad"
                                style={{ width: '100%' }}
                            />

                            <h3>Asignar Técnico por Robot</h3>
                            {idsRobot?.map((robotId, index) => (
                                <div key={index} className='robot-container'>
                                    <h4>Robot {robotId}</h4>
                                    <Dropdown
                                        value={asignaciones[robotId] || null} // puedes guardar los técnicos asignados por robot en un estado aparte
                                        options={tecnicos}
                                        onChange={(e) => asignarTecnico(robotId, e.value)}
                                        placeholder="Selecciona técnico"
                                    />

                                </div>
                            ))}

                            <div className='button-container'>
                                <button className='link-button' onClick={handleGuardar}>Guardar</button>
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