
export const RobotsAsignadosCards = ({robot, operaciones}) => {

    return (
      <section className="incidentes-cards">
        <div className="title">
          <h2>Robot {robot.id_robot}</h2>
        </div>
        <hr />
        <div className="opciones">
          <p>Incidente:</p>
          <p>{robot.id_incidente}</p>
        </div>
        <hr />
        <div className="opciones">
          <p>Lugar de Trabajo:</p>
          <p>{robot.lugar_trabajo}</p>
        </div>
        <hr />
        <div className="opciones">
          <p>Estado incidente:</p>
          <p>{robot.estado_incidente}</p>
        </div>
        <hr />
        <div className="botones">
          {operaciones}
        </div>
      </section>
      
    )
  }
  
  export default RobotsAsignadosCards;
  