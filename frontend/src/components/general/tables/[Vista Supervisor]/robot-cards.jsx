
export const RobotsCards = ({robot, operaciones = null}) => {

    return (
      <section className="incidentes-cards">
        <div className="title">
          <h2>Robot {robot?.id_robot}</h2>
        </div>
        <hr />
        <div className="opciones">
          <p>Lugar de Trabajo:</p>
          <p>{robot?.lugar_trabajo}</p>
        </div>
        <hr />
        <div className="opciones">
          <p>Estado:</p>
          {robot?.estado.toLowerCase() === "operativo" &&
            <p className="operativo">Operativo</p>
          }
          {robot?.estado.toLowerCase() === "en reparación" &&
            <p className="reparacion">En reparación</p>
          }
          {robot?.estado.toLowerCase() === "fuera de servicio" &&
            <p className="fueraservicio">Fuera de servicio</p>
          }
        </div>

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
  
  export default RobotsCards
  