import { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export default function AgregarRobot() {

  const [lugar, setLugar] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lugar) {
      setMensaje({ type: 'error', text: 'Todos los campos son obligatorios' });
      return;
    }

    try {

    const body = {
        lugar_trabajo: lugar
      };

      const response = await fetch('/robots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Error al crear el robot');

      setMensaje({ type: 'success', text: `Robot creado correctamente` });
      setLugar('');
    } catch (err) {
      console.error(err);
      setMensaje({ type: 'error', text: 'Ocurrió un error al crear un robot' });
    }
  };

  return (
    <>
    <h1>Agregar Robot</h1>
    <div className='crear-incidente'>
      <form onSubmit={handleSubmit} className="form-container">
        <div className='div-group'>
          <label htmlFor="nombre">Lugar de Trabajo</label>
          <InputText id="nombre" value={lugar} onChange={(e) => setLugar(e.target.value)} />
        </div>
        <div className='div-group'>
          <Button type="submit" label="Crear Robot" className='btn-crear-incidente'/>
          {mensaje && (
            <Message severity={mensaje.type} text={mensaje.text} className='msg'/>
          )}
        </div>
      </form>
    </div>
    </>
  );
}

