import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables/tables";
import TecnicosCards from "../../components/general/tables/[Vista Supervisor]/tecnico-cards"

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export const TecnicosAdmin = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ lugar: null, disponibilidad: null});

  const tableRef = useRef(null);

  useEffect(() => {
    fetch('/tecnicos/all')
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener técnicos');
        return response.json();
      })
      .then(async (tecnicos) => {
        const incidenteDataArray = [];
  
        const datosCompletos = await Promise.all(
          tecnicos.map(async (tecnico) => {
            try {
              const response = await fetch(`/incidentes-robots-tecnicos/robots-asignados/${tecnico.rut}`);
              if (!response.ok) throw new Error('Error en incidente/robot');
              const incidenteData = await response.json(); // <-- esto es un array
              const incidente = incidenteData[incidenteData.length - 1];

              incidenteDataArray.push(incidenteData);

              return {
                rut: tecnico.rut,
                nombre: tecnico.nombre,
                disponibilidad: tecnico.disponibilidad,
                robot: incidente?.id_robot || null,
                incidente: incidente?.id_incidente || null,
              };
            } catch (error) {
              console.error(`Error al obtener datos del técnico ${tecnico.rut}`, error);
              return {
                rut: tecnico.rut,
                nombre: tecnico.nombre,
                disponibilidad: tecnico.disponibilidad,
                robot: null,
                incidente: null,
              };
            }
          })
        );
  
        setTecnicos(datosCompletos);
      })
      .catch((error) => {
        console.error('[ERROR FETCH TECNICOS]', error);
      });
  }, []);

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
  }, [filters, searchText]);
  

  const filterTecnicos = (data) => {
    const filteredData = data?.filter(i => {
      const matchEstado = filters.disponibilidad === null || filters.disponibilidad === undefined || i.disponibilidad === filters.disponibilidad;
      const matchSearch = Object.values(i).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()));
      return matchEstado && matchSearch;
    });
  
    // Ordenar los incidentes por fecha ascendente
    return filteredData?.sort((b, a) => new Date(a.fecha_creado) - new Date(b.fecha_creado));
  };
  
  const filteredTecnicos = filterTecnicos(tecnicos);

  const totalPages = Math.ceil(filteredTecnicos?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleTecnicos = filteredTecnicos?.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <div className="filters mobile-filter-robots">
        <h1>Técnicos</h1>
        <div>
          <InputText id="busqueda" placeholder="Buscar..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          <Dropdown 
            id="filtro-disponibilidad"
            value={filters.disponibilidad}
            options={[
              { label: "Disponible", value: 1 },
              { label: "No disponible", value: 0 }
            ]}
            onChange={(e) => setFilters(f => ({ ...f, disponibilidad: e.value }))}
            placeholder="Disponibilidad"
            showClear={true}
          />
        </div>
      </div>
      
      <div className="card-container">  
        {
          filteredTecnicos?.map((tecnico) => (
            <TecnicosCards key={tecnico.rut} tecnico={tecnico} 
                operaciones={
                    <>
                        <Button label="Actualizar" 
                            severity="secondary"
                            size="small" 
                            outlined 
                            style={{ color: '#5C90C5'}}
                        />
            
                        <Button label="Borrar" 
                            severity="secondary"
                            size="small" 
                            outlined 
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
              <th>Disponibilidad</th>
              <th>Trabajando en</th>
              <th>Operación</th>
            </>
          }
          main={
            visibleTecnicos?.map((tecnico) => (
              <tr key={tecnico.rut}>
                <td>{tecnico.rut}</td>
                <td>{tecnico.nombre}</td>
                <td className={`disponibilidad-${tecnico.disponibilidad}`}>
                    <div>
                      <svg  xmlns="http://www.w3.org/2000/svg"  width={8}  height={8}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                        {tecnico.disponibilidad === 1? <p>Disponible</p> : <p>No disponible</p>}
                    </div>
                  </td>
                {tecnico.disponibilidad === 0?
                  <td>Robot {tecnico.robot} de Incidente {tecnico.incidente}</td> : <td>Sin asignar</td>
                }

                <td>
                  <button id="actualizar" className="btn-icon">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                  </button>
                  
                   <button id="borrar" className="btn-icon">
                     <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
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

export default TecnicosAdmin;
