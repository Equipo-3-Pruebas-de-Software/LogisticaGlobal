import { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

import { TabView, TabPanel } from 'primereact/tabview';

export default function AgregarRobot() {

  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firma, setFirma] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const roles = ["supervisor","jefe de turno","técnico"];

  const validarRut = (rut) => {
    // Formato: 8 dígitos, guion, 1 dígito verificador (puede ser k/K)
    const rutRegex = /^[0-9]{7,8}-[0-9kK]$/;
    return rutRegex.test(rut);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !rut || !rol || !password || !confirmPassword) {
      setMensaje({ type: 'error', text: 'Todos los campos son obligatorios' });
      return;
    }

    if (rol === "supervisor" && !firma.trim()) {
      setMensaje({ type: 'error', text: 'La firma es obligatoria para el rol de supervisor' });
      return;
    }

    if (!validarRut(rut)) {
      setMensaje({ type: 'error', text: 'El RUT no tiene un formato válido (Ej: 12345678-9)' });
      return;
    }

    if (password !== confirmPassword) {
      setMensaje({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    try {

    const body = {
        nombre,
        rut,
        rol,
        password,
      };

    if (rol === "supervisor") {
        body.firma = firma;
      }

      const response = await fetch('/api/auth/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Error al crear el funcionario');

      setMensaje({ type: 'success', text: `Funcionario creado correctamente` });
      setNombre('');
      setRut('');
      setRol('');
      setPassword('');
      setConfirmPassword('');
      setFirma('');
    } catch (err) {
      console.error(err);
      setMensaje({ type: 'error', text: 'Ocurrió un error al crear un funcionario' });
    }
  };

  return (
    <>
    <h1>Agregar nuevos funcionarios y robots</h1>
    <TabView>
      <TabPanel header="Crear Funcionario">
        <form onSubmit={handleSubmit} className="form-container">
        <div className='div-group'>
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className='div-group'>
          <label htmlFor="rut">Rut</label>
          <InputText id="rut" value={rut} onChange={(e) => setRut(e.target.value)} />
        </div>
        <div className='div-group'>
            <label htmlFor="password">Contraseña</label>
            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='div-group'>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <InputText id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className='div-group'>
          <label htmlFor="robots">Rol</label>
          <Dropdown
            id="rol"
            value={rol} 
            options={roles} 
            onChange={(e) => setRol(e.value)} 
            placeholder="Selecciona rol"
            />
        </div>
        {rol === "supervisor" && (
            <div className='div-group'>
              <label htmlFor="firma">Firma</label>
              <InputTextarea
                id="firma"
                value={firma}
                onChange={(e) => setFirma(e.target.value)}
                rows={3}
                cols={30}
                placeholder="Ingrese firma del supervisor"
              />
            </div>
          )}
        <div className='div-group'>
          <Button type="submit" label="Crear Funcionario" className='btn-crear-incidente'/>
          {mensaje && (
            <Message severity={mensaje.type} text={mensaje.text} className='msg'/>
          )}
        </div>
      </form>
      </TabPanel>
      <TabPanel header="Crear Robot">
        <form onSubmit={handleSubmit} className="form-container">
        <div className='div-group'>
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className='div-group'>
          <label htmlFor="rut">Rut</label>
          <InputText id="rut" value={rut} onChange={(e) => setRut(e.target.value)} />
        </div>
        <div className='div-group'>
            <label htmlFor="password">Contraseña</label>
            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='div-group'>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <InputText id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div className='div-group'>
          <label htmlFor="robots">Rol</label>
          <Dropdown
            id="rol"
            value={rol} 
            options={roles} 
            onChange={(e) => setRol(e.value)} 
            placeholder="Selecciona rol"
            />
        </div>
        {rol === "supervisor" && (
            <div className='div-group'>
              <label htmlFor="firma">Firma</label>
              <InputTextarea
                id="firma"
                value={firma}
                onChange={(e) => setFirma(e.target.value)}
                rows={3}
                cols={30}
                placeholder="Ingrese firma del supervisor"
              />
            </div>
          )}
        <div className='div-group'>
          <Button type="submit" label="Crear Funcionario" className='btn-crear-incidente'/>
          {mensaje && (
            <Message severity={mensaje.type} text={mensaje.text} className='msg'/>
          )}
        </div>
      </form>
      </TabPanel>
    </TabView>
    </>
  );
}

