
export const PersonasCards = ({persona, operaciones = null}, rol = true) => {

    return (
      <section className="incidentes-cards">
        <div className="title">
          <h2>{persona.nombre}</h2>
        </div>
        <hr />
        <div className="opciones">
          <p>Rut:</p>
          <p>{persona.rut}</p>
        </div>
        <hr />
        <div className="opciones">
            {rol ?  <p>Cantidad de Incidentes Creados:</p> :  <p>Cantidad de Incidentes Supervisados:</p>}
          <p>5</p>
        </div>
        <hr />    
        {operaciones != null &&
          <>
          <hr />
          <div className="botones">
            {operaciones}
          </div>
          </>
        }
      </section>
      
    )
  }
  
  export default PersonasCards
  