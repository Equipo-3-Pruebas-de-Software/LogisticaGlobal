import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables";
import TecnicosCards from "../../components/general/tables/[Vista Supervisor]/tecnico-cards"

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

export const TecnicosSupervisor = () => {
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

              let incidente = null

              if (incidenteData.length > 2) {
                incidente = incidenteData.reduce((masReciente, actual) => {
                  const fechaActual = new Date(actual.fecha_asignacion);
                  const fechaMasReciente = new Date(masReciente.fecha_asignacion);
                  return fechaActual > fechaMasReciente ? actual : masReciente;
                });
              } else {
                incidente = incidenteData[0]
              }

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
            <TecnicosCards key={tecnico.rut} tecnico={tecnico}/>
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
            </>
          }
          main={
            visibleTecnicos?.map((robot) => (
              <tr key={robot.rut}>
                <td>{robot.rut}</td>
                <td>{robot.nombre}</td>
                <td className={`disponibilidad-${robot.disponibilidad}`}>
                    <div>
                      <svg  xmlns="http://www.w3.org/2000/svg"  width={8}  height={8}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                        {robot.disponibilidad === 1? <p>Disponible</p> : <p>No disponible</p>}
                    </div>
                  </td>
                {robot.disponibilidad === 0?
                  <td>Robot {robot.robot} de Incidente {robot.incidente}</td> : <td>Sin asignar</td>
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

export default TecnicosSupervisor;