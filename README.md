
# LogisticaGlobal
Proyecto INF331 - Pruebas de Software. Aplicación web diseñada para facilitar el registro, clasificación y seguimiento de los incidentes ocurridos en los robots de inventario en el almacén de LogisticaGlobal. 

## Videos
- [Entrega 1](a)

## Problema planteado
En LogísticaGlobal.com, una empresa que utiliza robots automatizados para mover organizar y mover productos, suelen ocurrir incidentes como fallos mecánicos o colisiones, los cuales deben ser naturalmente reportados para mantener registro de los mismos y además solucionar cada robot en caso de ser necesario. Actualmente, el reporte de estos incidentes se realiza de manera física por un jefe de turno para luego ser recibido por un supervisor solo tras habre sido digitalizado usando Words y PDFs, esto genera una alta demanda de tiempo tanto para jefes de turno como también para el respectivo supervisor, volviéndome inviable a medida que aumenta la cantidad de robots usados (y a su vez de incidentes ocurridos).

## Sistema propuesto
El sistema desarrollado en este repositorio se encarga de gestionar la creación de incidentes mediante un flujo simple de datos, permitiendo el seguimiento de los incidentes en las diferentes etapas que involucra su solución, llevando además registro de cada incidente ingresando y otorgando estadística básicas para el análisis del negocio. Así los usuarios (con los permisos que corresponden a su cargo) tendrán una interfaz que permita:
  *  Reportar y comentar incidentes.
  *  Asignar técnicos a un incidente en particular
  *  Registrar una intervención y modificar el estado de un robot.
  *  Supervisar y aprobar el cierre de un incidente según el resultado de reparación
  *  Visualizar un resumen de los incidentes ocurrido y realizar seguimiento a incidentes particulares.

## Instalación
### Requisitos previos
  * Node.js (versión 16 o superior): Descargar Node.js
  * MySQL: Descargar MySQL
### Configuración Backend
Desde carpeta raíz:
``` Linea de comando
  cd backend
  npm install
  npm install cors
  npm start
```
### Configuración Frontend
Desde directorio raiz, en un nuevo terminal de comandos:
``` Linea de comando
  cd frontend
  npm install
  npm run dev
```
### Acceso a la aplicación
  * Abre tu navegador y ve a [Localhost](http://localhost:5173).
### Credenciales de Prueba
  Técnico
   - RUT: 14856536-8
   - Contraseña: clave123

  Supervisor
   - RUT: 12345677-9
   - Contraseña: clave123
     
  Jefe de Turno
   - RUT: 11111111-1
   - Contraseña: clave123

## Enlaces 
   - [HandsOnProject](https://github.com/Pruebas-de-Software/HandsOnProject/blob/main/semestres/2025-1/logisticaglobal.md)
   - [Wiki](https://github.com/Equipo-3-Pruebas-de-Software/LogisticaGlobal/wiki)

## Notas
   - Actualmente un robot puede tener más de un incidente asignado, pero en el resultado final un robot exclusivamente puede estar en un incidente con estado activo.
   - Las contraseñas actuales no tienen un proceso de encriptado para mejorar la seguridad de estas, pero en un proceso futuro se tiene contemplada esta implementación.
   - En la lógica final, un técnico puede cambiar el estado del robot pero no puede cambiar el estado del incidente.




