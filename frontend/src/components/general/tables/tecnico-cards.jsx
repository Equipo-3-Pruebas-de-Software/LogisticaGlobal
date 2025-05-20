
export const TecnicosCards = ({tecnico}) => {
    return (
      <section className="incidentes-cards">
        <div className="title">
          <h2>{tecnico.nombre}</h2>
          {tecnico.disponibilidad === 1? <h2 className="disponible">Disponibile</h2> : <h2 className="no-disponible">No disponible</h2>}
        </div>
        <hr />
        <div className="opciones">
          <p>Rut:</p>
          <p>{tecnico.rut}</p>
        </div>
        <hr />
        <div className="opciones">
          <p>Trabajando en:</p>
          {tecnico.disponibilidad === 0?
            <p>Robot {tecnico.robot} de Incidente {tecnico.incidente}</p> : <p>Sin asignar</p>
          }
        </div>
      </section>
      
    )
  }
  
  export default TecnicosCards
  