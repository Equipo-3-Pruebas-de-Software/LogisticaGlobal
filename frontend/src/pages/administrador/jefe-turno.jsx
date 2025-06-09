import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables";
import PersonasCards from "../../components/general/tables/[Vista Admin]/card";

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

export const JefeTurnoAdmin = () => {
  const [supervisores, setSupervisores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [supervisorEdit, setSupervisorEdit] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const tableRef = useRef(null);

  useEffect(() => {
    fetch('/api/auth/jefes-turno')
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener incidentes');
        return response.json();
      })
      .then((data) => {
        const supervisoresActivos = data.filter((supervisor) => supervisor.activo === 1);
        setSupervisores(supervisoresActivos);
      })
      .catch((error) => {
        console.error('[ERROR FETCH INCIDENTES]', error);
      });
  }, []);

  const handleDelete = async (rut) => {
  try {
    const response = await fetch('/api/auth/funcionarios-delete', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut, rol: 'jefe de turno' }),
    });

    if (!response.ok) throw new Error('Error al eliminar');

    // Eliminar del estado local
    setSupervisores(prev => prev.filter(p => p.rut !== rut));
  } catch (error) {
    console.error('[ERROR BORRANDO SUPERVISOR]', error);
  }
};

  const openUpdateModal = (supervisor) => {
    setSupervisorEdit(supervisor);
    setVisibleModal(true);
  };

  const handleUpdate = async () => {
    if (!supervisorEdit?.rut) return;

    try {
      const { rut, password, firma } = supervisorEdit;
      
      const response = await fetch('/api/auth/funcionarios-update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut,
          rol: 'jefe de turno',
          password: password? password : null,
          firma: firma? firma : null,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      setMensaje({ type: 'success', text: `Funcionario actualizado correctamente` });

      // Actualiza en estado local (opcional, depende de backend)
      setSupervisores(prev =>
        prev.map(p => (p.rut === rut ? { ...p, ...supervisorEdit } : p))
      );

    setTimeout(() => {
      setVisibleModal(false);
      setMensaje(null);
    }, 1500);
    } catch (error) {
      console.error('[ERROR ACTUALIZANDO SUPERVISOR]', error);
      setMensaje({ type: 'error', text: 'Ocurrió un error al actualizar al funcionario' });
    }
  };


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
  }, [searchText]);
  

  const filterTecnicos = (data) => {
    const filteredData = data?.filter(i => {
      const matchSearch = Object.values(i).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()));
      return matchSearch;
    });
  
    // Ordenar los incidentes por fecha ascendente
    return filteredData?.sort((b, a) => new Date(a.fecha_creado) - new Date(b.fecha_creado));
  };
  
  const filteredTecnicos = filterTecnicos(supervisores);

  const totalPages = Math.ceil(filteredTecnicos?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleTecnicos = filteredTecnicos?.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <Dialog header="Actualizar Jefe de Turno" visible={visibleModal} onHide={() => setVisibleModal(false)}>
      <div className="p-fluid">
        <div className="field" style={{ marginBottom: '1rem'}}>
          <label>Contraseña</label>
          <InputText type="password" value={supervisorEdit?.password || ''} onChange={(e) => setSupervisorEdit({ ...supervisorEdit, password: e.target.value })} />
        </div>
        <Button label="Actualizar" onClick={handleUpdate} style={{ backgroundColor: '#5C90C5', border: '1px solid #5C90C5'}}/>
        {mensaje && (
          <Message severity={mensaje.type} text={mensaje.text} className='msg'/>
        )}
      </div>
    </Dialog>

      <div className="filters mobile-filter-robots">
        <h1>Jefes de Turno</h1>
        <div>
          <InputText id="busqueda" placeholder="Buscar..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
      </div>
      
      <div className="card-container">  
        {
          filteredTecnicos?.map((supervisor) => (
            <PersonasCards key={supervisor.rut} rol={false} persona={supervisor} 
                operaciones={
                    <>
                        <Button label="Actualizar" 
                            severity="secondary"
                            size="small" 
                            outlined 
                            style={{ color: '#5C90C5'}}
                            onClick={() => openUpdateModal(supervisor)}
                        />
            
                        <Button label="Borrar" 
                            severity="secondary"
                            size="small" 
                            outlined 
                            onClick={() => handleDelete(supervisor.rut)}
                        />
                    </>
                }
            />
          ))
        }
      </div>

      <div className="table-container" ref={tableRef}>
        <Tables
          header={
            <>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Cantidad de Incidentes Supervisados:</th>
              <th>Operaciones</th>
            </>
          }
          main={
            visibleTecnicos?.map((supervisor) => (
              <tr key={supervisor.rut}>
                <td>{supervisor.rut}</td>
                <td>{supervisor.nombre}</td>
                <td>{supervisor.incidentes.length}</td>

                <td>
                  <button id="actualizar" className="btn-icon">
                    <svg  xmlns="http://www.w3.org/2000/svg" onClick={() => openUpdateModal(supervisor)}  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                  </button>
                  
                   <button id="borrar" className="btn-icon">
                     <svg  xmlns="http://www.w3.org/2000/svg" onClick={() => handleDelete(supervisor.rut)} width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                   </button>
                </td>
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

export default JefeTurnoAdmin;

