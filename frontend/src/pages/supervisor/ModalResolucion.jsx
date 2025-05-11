import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Message } from 'primereact/message';


export const ModalResolucion = ({onClose, incidente}) => {

    const { usuario } = useUser();

    const [mensaje, setMensaje] = useState(null);
      
    const handleGuardar = async () => {
      try {
          const patchIncidente = await fetch(`/incidentes/resolver`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rut_supervisor: usuario.rut,
              firma: usuario.firma,
              id_incidente: incidente.id_incidentes
            })
          });
      
          if (!patchIncidente.ok) {
            throw new Error('Error al actualizar incidente');
          }
      
          setMensaje({ type: 'success', text: `Incidente firmado correctamente` });
          setTimeout(() => {
            onClose();
          }, 1500);
      
        } catch (error) {
          console.error('[ERROR PATCH]', error);
          setMensaje({ type: 'error', text: error.message || 'No se pudieron guardar los cambios' });
        }
      };  
      

    return (
      <div className="modal-overlay">
        <div className="modal-resolucion">
          <button className="btn-icon" onClick={() => onClose()}>
            <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
          </button>
          <div>
            {incidente.estado?.toLowerCase() === "resuelto" && 
              <h1 className='botton-margin'>Este incidente ya ha sido resuelto</h1>
            }

            {incidente.estado?.toLowerCase() != "resuelto" && incidente.estado?.toLowerCase() != "espera revisión" && 
              <h1 className='botton-margin'>Este incidente aún no espera aprobación</h1>
            }

            {incidente.estado?.toLowerCase() === "espera revisión" && 
              <>
                <h1>¿Estás seguro qué deseas resolver este incidente?</h1>
                <button onClick={handleGuardar} className='link-button' style={{ fontSize: '1.2rem' , marginTop: "10px" }}>Confirmar</button>
                {mensaje && (
                    <Message severity={mensaje.type} text={mensaje.text} className='msg' style={{ width: '100%' , position: "relative" , zIndex: "999" }}/>
                  )}
              </>
                
            }
            
                
                

          </div>
            
        </div>
      </div>
    )
  }
  
  export default ModalResolucion;