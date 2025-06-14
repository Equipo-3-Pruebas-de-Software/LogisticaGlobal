import { useEffect, useRef, useState } from "react";
import { formatFecha } from "../../utils/date";
import Tables from "../../components/general/tables";
import IncidentesCards from "../../components/general/tables/[Vista Supervisor]/supervisor-cards";
import ModalIncidentes from "./ModalIncidentes";
import ModalResolucion from "./ModalResolucion" ;

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

import { useUser } from '../../context/UserContext';

export const Incidentes = () => {
  const { usuario } = useUser();
  const [filtrosMobile, setFiltrosMobile] = useState(false);

  const [incidentes, setIncidentes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalFirmarOpen, setModalFirmarOpen] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ lugar: null, estado: null, prioridad: null, gravedad: null, fechaInicio: null, fechaFin: null , tipoIncidente: "All"});

  const tableRef = useRef(null);

  const uniqueValues = (key) => {
    const seen = new Map();
  
    incidentes?.forEach(i => {
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
    fetch('/incidentes')
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener incidentes');
        return response.json();
      })
      .then((data) => {
        setIncidentes(data); 
      })
      .catch((error) => {
        console.error('[ERROR FETCH INCIDENTES]', error);
      });
  }, [isModalOpen, isModalFirmarOpen]);

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

  const handleOpenModal = (incidente) => {
    setSelectedIncidente(incidente);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedIncidente(null);
    setModalOpen(false);
  };

  const handleOpenModalFirmar = (incidente) => {
    setSelectedIncidente(incidente);
    setModalFirmarOpen(true);
  };

  const handleCloseModalFirmar = () => {
    setSelectedIncidente(null);
    setModalFirmarOpen(false);
  };

    const filterIncidentes = (data) => {
    return data?.filter(i => {
      const matchEstado = !filters.estado || i.estado?.toLowerCase() === filters.estado?.toLowerCase();
      const matchPrioridad = !filters.prioridad || i.prioridad === filters.prioridad;
      const matchGravedad = !filters.gravedad || i.gravedad?.toLowerCase() === filters.gravedad?.toLowerCase();
      const matchSearch = Object.values(i).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()));

      const matchTipo = filters.tipoIncidente === "All" || (filters.tipoIncidente === "My" && i.supervisor_asignado === usuario.rut);

      const fecha = new Date(i.fecha_creado);
      const matchFechaInicio = !filters.fechaInicio || fecha >= new Date(filters.fechaInicio);
      const matchFechaFin = !filters.fechaFin || fecha <= new Date(filters.fechaFin);

      return matchEstado && matchPrioridad && matchGravedad && matchSearch && matchTipo && matchFechaInicio && matchFechaFin;
    }).sort((b, a) => new Date(a.fecha_creado) - new Date(b.fecha_creado));
  };

  
  const filteredIncidentes = filterIncidentes(incidentes);

  const totalPages = Math.ceil(filteredIncidentes?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleIncidentes = filteredIncidentes?.slice(startIndex, startIndex + rowsPerPage);

  const toggleFiltrosMobile = () => {
    setFiltrosMobile(!filtrosMobile);
  };

  return (
    <>
      {isModalOpen && <ModalIncidentes onClose={handleCloseModal} incidente={selectedIncidente} />}
      {isModalFirmarOpen && <ModalResolucion onClose={handleCloseModalFirmar} incidente={selectedIncidente} />}
      <div className="filters mobile-filter">
        <div className="title-filter">
          <h1>Incidentes</h1>
          <div className="button-group">
            <Button label="Todos los Incidentes" 
                    severity="secondary"
                    size="small" 
                    outlined 
                    onClick={() => setFilters(f => ({ ...f, tipoIncidente: "All"}))}
                    style={{ color: '#5C90C5'}}
            />

            <Button label="Mis Incidentes" 
                    severity="secondary"
                    size="small" 
                    outlined 
                    onClick={() => setFilters(f => ({ ...f, tipoIncidente: "My"}))}
                    style={{ color: '#5C90C5'}}
            />

          </div>

          
          {filtrosMobile &&
          
          <Button label="Ocultar filtros" 
                  severity="secondary"
                  size="small" 
                  outlined 
                  onClick={toggleFiltrosMobile}
                  className="mobile-filter-button"
          />}

          {!filtrosMobile &&
          <Button label="Mostrar filtros" 
                  severity="secondary"
                  size="small" 
                  outlined 
                  onClick={toggleFiltrosMobile}
                  className="mobile-filter-button"
          />}
        </div>

      <div className={`${filtrosMobile ? 'all-filters-mobile' : 'all-filters'}`}>
          <InputText id="busqueda" placeholder="Buscar..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          <Dropdown
            id = "filtro-estado"
            value={filters.estado}
            options={uniqueValues("estado")}
            onChange={(e) => setFilters(f => ({ ...f, estado: e.value }))}
            placeholder="Estado"
            showClear={true}
          />
          <Dropdown
            id = "filtro-prioridad"
            value={filters.prioridad}
            options={uniqueValues("prioridad")}
            onChange={(e) => setFilters(f => ({ ...f, prioridad: e.value }))}
            placeholder="Prioridad"
            showClear={true}
          />
          <Dropdown
            id = "filtro-gravedad"
            value={filters.gravedad}
            options={uniqueValues("gravedad")}
            onChange={(e) => setFilters(f => ({ ...f, gravedad: e.value }))}
            placeholder="Gravedad"
            showClear={true}
          />
          <Calendar
            value={filters.fechaInicio}
            onChange={(e) => setFilters(f => ({ ...f, fechaInicio: e.value }))}
            placeholder="Fecha Inicio"
            showIcon
          />
          <Calendar
            value={filters.fechaFin}
            onChange={(e) => setFilters(f => ({ ...f, fechaFin: e.value }))}
            placeholder="Fecha Fin"
            showIcon
          />
      </div>
    </div>

    <div className="card-container">  
      {
        visibleIncidentes?.map((incidente) => (
          <IncidentesCards key={incidente.id_incidentes} incidente={incidente}
          operaciones={
            <>
            <Button label="Mostrar detalles" 
              severity="secondary"
              size="small" 
              outlined 
              onClick={() => handleOpenModal(incidente)}
            />

            {incidente.supervisor_asignado === usuario.rut && 
              <Button label="Firmar" 
                severity="secondary"
                size="small" 
                outlined 
                onClick={() => handleOpenModalFirmar(incidente)}
                style={{ color: '#5C90C5'}}
            />
            }
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
              <th>ID</th>
              <th>Lugar</th>
              <th>Fecha del Incidente</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Gravedad</th>
              <th>Operación</th>
            </>
          }
          main={
            visibleIncidentes?.map((incidente) => (
              <tr key={incidente.id_incidentes}>
                <td>{incidente.id_incidentes}</td>
                <td>{incidente.lugar}</td>
                <td>{formatFecha(incidente.fecha_creado)}</td>
                <td>{incidente.estado}</td>
                
                {incidente.prioridad? 
                  <td>
                    <p>{incidente.prioridad}</p>
                  </td> : <td></td>
                }
                    
                {incidente.gravedad? 
                  <td className={`prioridad-${incidente.gravedad?.toLowerCase()}`}>
                    <div>
                      <svg  xmlns="http://www.w3.org/2000/svg"  width={8}  height={8}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                        <p>{incidente.gravedad}</p>
                    </div>
                  </td> : <td></td>
                }

                <td>
                  <button id="detalles" className="btn-icon" onClick={() => handleOpenModal(incidente)}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none" stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-file-description"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 17h6" /><path d="M9 13h6" /></svg>
                  </button>
                  {incidente.supervisor_asignado === usuario.rut && 
                    <button id="firmar" className="btn-icon" onClick={() => handleOpenModalFirmar(incidente)}>
                      <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-writing"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" /><path d="M16 7h4" /><path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" /></svg>
                    </button>
                  }
                  
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

export default Incidentes;