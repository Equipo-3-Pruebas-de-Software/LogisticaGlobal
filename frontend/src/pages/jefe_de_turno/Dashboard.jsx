import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';

import { InputTextarea } from 'primereact/inputtextarea';
        
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import RobotsData from '../../mockups/robots.json';

export default function CrearIncidenteForm() {
  const [lugar, setLugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [robotsSeleccionados, setRobotsSeleccionados] = useState([]);
  const [robotsDisponibles, setRobotsDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    // Formatea los robots mockeados
    const opciones = RobotsData.map(robot => ({
      label: `Robot ${robot.id_robot}`,
      value: robot.id_robot
    }));
    setRobotsDisponibles(opciones);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lugar || !descripcion || robotsSeleccionados.length === 0) {
      setMensaje({ type: 'error', text: 'Todos los campos son obligatorios' });
      return;
    }

    try {
      const response = await fetch('/incidentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lugar: lugar,
          descripcion: descripcion,
          robots: robotsSeleccionados
        })
      });

      if (!response.ok) throw new Error('Error al crear el incidente');

      const data = await response.json();
      setMensaje({ type: 'success', text: `Incidente creado (ID: ${data.incidenteId})` });
      setLugar('');
      setDescripcion('');
      setRobotsSeleccionados([]);
    } catch (err) {
      console.error(err);
      setMensaje({ type: 'error', text: 'Ocurrió un error al crear el incidente' });
    }
  };

  return (
    <>
    <h2>Crear Incidente</h2>
    <div className='crear-incidente'>
      {mensaje && (
        <Message severity={mensaje.type} text={mensaje.text} className='msg'/>
      )}
      <form onSubmit={handleSubmit} className="form-container">
        <div className='div-group'>
          <label htmlFor="lugar">Lugar</label>
          <InputText id="lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} />
        </div>
        <div className='div-group'>
          <label htmlFor="descripcion">Descripción</label>
          <InputTextarea id="descripcion" rows={4} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div className='div-group'>
          <label htmlFor="robots">Robots involucrados</label>
          <MultiSelect
            id="robots"
            options={robotsDisponibles}
            value={robotsSeleccionados}
            onChange={(e) => setRobotsSeleccionados(e.value)}
            placeholder="Selecciona uno o más robots"
          />
        </div>
        <div className='div-group'>
          <Button type="submit" label="Crear Incidente" className='btn-crear-incidente'/>
        </div>
      </form>
    </div>
    </>
  );
}

