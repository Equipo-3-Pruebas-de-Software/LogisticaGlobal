// Página principal de incidentes
// Acá se muestra la lista de incidentes, debe permitir filtrarlos
// Agregar botón para crear un nuevo incidente (via modal)

// Maybe al darle click, se abra un modal que muestre todos los detalles
// Te pide el seguimiento tipo starken con marcas de tiempo

import { useEffect, useRef, useState } from "react";
import { formatFecha } from "../../utils/date";
import Tables from "../../components/general/tables";
import incidentes from "../../mockups/incidentes.json";
import ModalIncidentes from "./ModalIncidentes";

export const Incidentes = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Inicial
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIncidente, setSelectedIncidente] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const updateRowsPerPage = () => {
      if (tableRef.current) {
        const offsetTop = tableRef.current.getBoundingClientRect().top;
        const availableHeight = window.innerHeight - offsetTop - 120; // margen para botones y paddings
        const rowHeight = 60; // ajusta a tu diseño real
        const possibleRows = Math.floor(availableHeight / rowHeight);
        setRowsPerPage(possibleRows > 0 ? possibleRows : 1);
      }
    };

    updateRowsPerPage();
    window.addEventListener("resize", updateRowsPerPage);
    return () => window.removeEventListener("resize", updateRowsPerPage);
  }, []);

  const totalPages = Math.ceil(incidentes.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const visibleIncidentes = incidentes.slice(startIndex, startIndex + rowsPerPage);

  const handleOpenModal = (incidente) => {
    setSelectedIncidente(incidente);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedIncidente(null);
    setModalOpen(false);
  };
  
    return (
      <>
        {isModalOpen && <ModalIncidentes onClose={handleCloseModal} incidente={selectedIncidente}/>}
        <h1>Incidentes</h1>
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
                visibleIncidentes.map((incidente) => (
                  <tr key={incidente.id}>
                    <td>{incidente.id}</td>
                    <td>{incidente.lugar}</td>
                    <td>{formatFecha(incidente.fecha_creado)}</td>
                    <td>{incidente.estado}</td>

                    {incidente.prioridad? 
                      <td className={`prioridad-${incidente.prioridad?.toLowerCase()}`}>
                        <div>
                          <svg  xmlns="http://www.w3.org/2000/svg"  width={8}  height={8}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                          <p>{incidente.prioridad}</p>
                        </div>
                      </td> :
                      <td></td>
                    }
                    
                    {incidente.gravedad? 
                      <td className={`prioridad-${incidente.gravedad?.toLowerCase()}`}>
                        <div>
                          <svg  xmlns="http://www.w3.org/2000/svg"  width={8}  height={8}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" /></svg>
                          <p>{incidente.gravedad}</p>
                        </div>
                      </td> :
                      <td></td>
                    }
                    <td>
                      <button className="btn-icon" onClick={() => handleOpenModal(incidente)}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none" stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-file-description"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 17h6" /><path d="M9 13h6" /></svg>
                      </button>
                      <button className="btn-icon">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none" stroke="currentColor" strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-writing"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z" /><path d="M16 7h4" /><path d="M18 19h-13a2 2 0 1 1 0 -4h4a2 2 0 1 0 0 -4h-3" /></svg>
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
    )
  }
  
  export default Incidentes;