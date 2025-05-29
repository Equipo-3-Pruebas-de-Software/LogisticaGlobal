import { useEffect, useRef, useState } from "react";
import Tables from "../../components/general/tables";

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

export const ReportesSupervisor = () => {
  const [reportes, setReportes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ lugar: null,fechaDesde: '',fechaHasta: ''});

  const tableRef = useRef(null);

  const uniqueValues = (key) => {
    const seen = new Map();
    
    reportes?.forEach(i => {
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
    fetch('/reportes')
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener incidentes');
        return response.json();
      })
      .then((data) => {
        setReportes(data); 
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

  const filterReportes = (data) => {
    const filteredData = data?.filter(i => {
      const matchSearch = Object.values(i).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()));
      const fechaReporte = new Date(i.fecha_creado);
      const fechaDesde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
      const fechaHasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;

      const matchFecha =
        (!fechaDesde || fechaReporte >= fechaDesde) &&
        (!fechaHasta || fechaReporte <= fechaHasta);
      return matchSearch && matchFecha;
    });
  
    // Ordenar los incidentes por fecha ascendente
    return filteredData?.sort((b, a) => new Date(a.fecha_creado) - new Date(b.fecha_creado));
  };
  
  const filteredReportes = filterReportes(reportes);

  const totalPages = Math.ceil(filteredReportes?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleReportes = filteredReportes?.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <div className="filters">
        <h1>Reportes</h1>
        <div>
            <InputText
            id="busqueda"
            placeholder="Buscar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            />
            

            {/* Filtro de fecha: Desde */}
            <span style={{ marginLeft: '1rem' }}>Desde:</span>
            <input
            type="date"
            value={filters.fechaDesde}
            onChange={(e) => setFilters(f => ({ ...f, fechaDesde: e.target.value }))}
            />

            {/* Filtro de fecha: Hasta */}
            <span style={{ marginLeft: '1rem' }}>Hasta:</span>
            <input
            type="date"
            value={filters.fechaHasta}
            onChange={(e) => setFilters(f => ({ ...f, fechaHasta: e.target.value }))}
            />
        </div>
      </div>
        
      <div className="table-container">
        <Tables
            header={
            <>
                <th>ID</th>
                <th>Nombre de reporte</th>
                <th>Fecha de generación</th>
                <th>Cantidad de incidentes</th>
            </>
            }
            main={
            visibleReportes?.map((reporte) => (
                <React.Fragment key={reporte.id_reporte}>
                <tr>
                    <td>{reporte.id_reporte}</td>
                    <td>{reporte.fecha_creado}</td>
                    <td>{reporte.cantidad_incidentes || 'N/A'}</td>
                    <td>
                    <button onClick={() => toggleDetalle(reporte)}>
                        {reporteSeleccionado?.id_reporte === reporte.id_reporte
                        ? 'Ocultar'
                        : 'Ver más'}
                    </button>
                    </td>
                </tr>

                {reporteSeleccionado?.id_reporte === reporte.id_reporte && (
                    <tr>
                    <td colSpan="4">
                        <div className="detalle-reporte">
                        {/* Aquí agregas la info extra */}
                        <p><strong>Descripción:</strong> {reporte.descripcion || 'Sin descripción'}</p>
                        <p><strong>Generado por:</strong> {reporte.rut_jefe_turno || 'Desconocido'}</p>
                        {/* puedes agregar más campos aquí */}
                        </div>
                    </td>
                    </tr>
                )}
                </React.Fragment>
            ))
            }
        />
        </div>
    </>
  );
};

export default ReportesSupervisor;