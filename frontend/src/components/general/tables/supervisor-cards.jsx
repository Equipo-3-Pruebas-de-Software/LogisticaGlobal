
import { formatFecha } from "../../../utils/date"

export const IncidentesCards = ({incidente, operaciones}) => {

    return (
      <section className="incidentes-cards">
        <div className="title">
          <h2>Incidente {incidente.id_incidentes}</h2>
          <h2 className="estado">{incidente.estado}</h2>
        </div>
        <hr />
        <div className="opciones">
          <p>Lugar:</p>
          <p>{incidente.lugar}</p>
        </div>
        <hr />
        <div className="opciones">
          <p>Fecha:</p>
          <p>{formatFecha(incidente.fecha_creado)}</p>
        </div>
        <hr />
        <div className="opciones">
          <p>Prioridad:</p>
          <p>{incidente.prioridad}</p>
        </div>
        <hr />
        <div className="opciones">
          <p>Gravedad:</p>
          <p>{incidente.gravedad}</p>
        </div>
        <hr />
        <div className="botones">
          {operaciones}
        </div>
      </section>
      
    )
  }
  
  export default IncidentesCards
  