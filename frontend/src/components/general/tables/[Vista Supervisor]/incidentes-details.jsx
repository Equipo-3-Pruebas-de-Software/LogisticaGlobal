
export const DetailsCards = ({robot, tecnico, comentario}) => {

    return (
      <section className="details-cards">
        <p className="title"><b>Robot {robot}</b> asignado a <b>{tecnico}</b></p>
        <hr />
        <div className="opciones">
          <b>Comentario:</b>
          <p>{comentario}</p>
        </div>
      </section>
      
    )
  }
  
  export default DetailsCards