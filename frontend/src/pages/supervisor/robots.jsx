import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables";

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import RobotsCards from "../../components/general/tables/[Vista Supervisor]/robot-cards";

export const RobotsSupervisor = () => {
  const [robots, setRobots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ lugar: null, estado: null,});

  const tableRef = useRef(null);

  const uniqueValues = (key) => {
    const seen = new Map();
    
    robots?.forEach(i => {
      const value = i[key];
  
      if (value !== null && value !== undefined) { // Verifica que el valor no sea null o undefined
        if (typeof value === 'string' && value.trim() !== "") {
          const lower = value.toLowerCase();
          if (!seen.has(lower)) {
            seen.set(lower, value); // Guarda la primera aparición (con su case original)
          }
        } else if (typeof value === 'number') {
          if (!seen.has(value)) {
            seen.set(value, value); // Guarda el número directamente
          }
        } else {
          // Puedes agregar lógica para otros tipos de datos si es necesario (booleanos, etc.)
          if (!seen.has(value)) {
            seen.set(value, value);
          }
        }
      }
    });
  
    return Array.from(seen.values());
  };

  useEffect(() => {
    fetch('/robots')
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener incidentes');
        return response.json();
      })
      .then((data) => {
        setRobots(data); 
      })
      .catch((error) => {
        console.error('[ERROR FETCH INCIDENTES]', error);
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

  const filterRobots = (data) => {
    const filteredData = data?.filter(i => {
      const matchEstado = !filters.estado || i.estado?.toLowerCase() === filters.estado?.toLowerCase();
      const matchSearch = Object.values(i).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()));
      return matchEstado && matchSearch;
    });
  
    // Ordenar los incidentes por fecha ascendente
    return filteredData?.sort((b, a) => new Date(a.fecha_creado) - new Date(b.fecha_creado));
  };
  
  const filteredRobots = filterRobots(robots);

  const totalPages = Math.ceil(filteredRobots?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleRobots = filteredRobots?.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <div className="filters">
        <h1>Robots</h1>
        <div>
          <InputText id="busqueda" placeholder="Buscar..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          <Dropdown 
            id = "filtro-estado"
            value={filters.estado} 
            options={uniqueValues("estado")}
            onChange={(e) => setFilters(f => ({ ...f, estado: e.value }))} 
            placeholder="Estado"
            showClear={true}
          />
        </div>
      </div>
        
      <div className="table-container" ref={tableRef}>
        <Tables
          header={
            <>
              <th>ID</th>
              <th>Lugar de Trabajo</th>
              <th>Estado</th>
            </>
          }
          main={
            visibleRobots?.map((robot) => (
              <tr key={robot.id_robot}>
                <td>{robot.id_robot}</td>
                <td>{robot.lugar_trabajo}</td>
                <td className={`estado-${robot.estado?.toLowerCase()}`}>
                    <div>
                      <svg  xmlns="http://www.w3.org/2000/svg"  width={8}  height={8}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                        <p>{robot.estado}</p>
                    </div>
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

export default RobotsSupervisor;
