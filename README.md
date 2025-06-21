# LogisticaGlobal
Proyecto INF331 - Pruebas de Software. Aplicación web diseñada para facilitar el registro, clasificación y seguimiento de los incidentes ocurridos en los robots de inventario en el almacén de LogisticaGlobal. 

## 💼 Grupo de trabajo
Este es el repositorio del equipo 3, cuyos integrantes son:
- Joaquín Aguilera ([Perfil de Github](https://github.com/Hakdyr))
- Valentina Castillo ([Perfil de Github](https://github.com/valnhe))
- Marcelo Fernández ([Perfil de Github](https://github.com/koockie))
- Javier Hormaechea ([Perfil de Github](https://github.com/JavierHormaechea))

## 🔗 Enlaces útiles

### 📽️ Presentaciones y videos explicativos
- [Video entrega 1](https://www.youtube.com/watch?v=0c-y_6oEMyo)
  - [Presentación entrega 1](https://usmcl-my.sharepoint.com/:p:/g/personal/valentina_castillov_usm_cl/EYV3yfHt4w1Ni9QUvV4qyOEBkaqrvA5PQOtYOJBE8HsjOA?e=H1knpA)
- [Video entrega 2](https://youtu.be/JysALs6Ovfw)
  - [Presentación entrega 2](https://usmcl-my.sharepoint.com/:p:/g/personal/valentina_castillov_usm_cl/EQo9sztYOetJizY5BMrkVKEBkAe5D0mYgmAOib0OUNwk0w?e=6JTkRw)
- [Video entrega 3]()
  - [Presentación entrega 3](https://usmcl-my.sharepoint.com/:p:/g/personal/valentina_castillov_usm_cl/Eci9v7fS-DBPrs2TLG4SpTsB_8HDW5wzak0_JyfAEHeY_A?e=sSCSW5)
  - [Informe entrega 3](https://github.com/Equipo-3-Pruebas-de-Software/LogisticaGlobal/blob/main/Entrega3.md)

### Wikis
- [HandsOnProject](https://github.com/Pruebas-de-Software/HandsOnProject/blob/main/semestres/2025-1/logisticaglobal.md)
- [Wiki del Proyecto](https://github.com/Equipo-3-Pruebas-de-Software/LogisticaGlobal/wiki)

## 📌 Problema planteado
En LogísticaGlobal.com, una empresa que utiliza robots automatizados para mover organizar y mover productos, suelen ocurrir incidentes como fallos mecánicos o colisiones, los cuales deben ser naturalmente reportados para mantener registro de los mismos y además solucionar cada robot en caso de ser necesario. Actualmente, el reporte de estos incidentes se realiza de manera física por un jefe de turno para luego ser recibido por un supervisor solo tras habre sido digitalizado usando Words y PDFs, esto genera una alta demanda de tiempo tanto para jefes de turno como también para el respectivo supervisor, volviéndome inviable a medida que aumenta la cantidad de robots usados (y a su vez de incidentes ocurridos).

## ⭐ Sistema propuesto
El sistema desarrollado en este repositorio se encarga de gestionar la creación de incidentes mediante un flujo simple de datos, permitiendo el seguimiento de los incidentes en las diferentes etapas que involucra su solución, llevando además registro de cada incidente ingresando y otorgando estadística básicas para el análisis del negocio. Así los usuarios (con los permisos que corresponden a su cargo) tendrán una interfaz que permita:
  *  Reportar y comentar incidentes.
  *  Asignar técnicos a un incidente en particular
  *  Registrar una intervención y modificar el estado de un robot.
  *  Supervisar y aprobar el cierre de un incidente según el resultado de reparación
  *  Visualizar un resumen de los incidentes ocurrido y realizar seguimiento a incidentes particulares.

## 🧱 Tech Stack

### 🎨 Frontend
El frontend de la aplicación está construido utilizando React para la creación de componentes reutilizables, y Vite como bundler para desarrollo y compilación rápida. Esta combinación permite una experiencia de desarrollo fluida y un rendimiento óptimo en producción.
- Vite: Herramienta de construcción rápida y moderna para proyectos frontend.
- React: Biblioteca JavaScript para construir interfaces de usuario interactivas y reactivas.

### ⚙️ Backend
El backend está implementado con Node.js, lo cual permite utilizar JavaScript también del lado del servidor. MySQL se encarga del almacenamiento estructurado de datos, facilitando consultas relacionales eficientes. Esta arquitectura permite una integración fluida con el frontend y asegura escalabilidad.
- Node.js: Entorno de ejecución para JavaScript en el servidor.
- MySQL: Sistema de gestión de bases de datos relacional.

### 🧪 Testing
Cypress permite escribir, ejecutar y depurar pruebas automatizadas directamente en el navegador. Se utiliza para garantizar que las funcionalidades clave de la aplicación se comporten correctamente desde la perspectiva del usuario.
- Cypress (CY): Framework de pruebas end-to-end

### 🚀 CI/CD (Integración y Despliegue Continuo
El flujo CI/CD está diseñado para automatizar pruebas, construir contenedores Docker y desplegar automáticamente en instancias EC2 de AWS. Jenkins orquesta el proceso y Octopus gestiona los entornos de entrega. Esta configuración permite reducir errores humanos y acelerar los ciclos de desarrollo.
- Jenkins: Servidor de automatización para pipelines de integración continua.
- Octopus Deploy: Herramienta para la gestión del despliegue continuo.
- Docker: Contenerización de la aplicación para asegurar entornos consistentes.
- Amazon EC2: Infraestructura en la nube donde se alojan los contenedores.

## 🖥️ Instalación
### 💾 Requisitos previos
  * Node.js (versión 16 o superior): Descargar Node.js
  * MySQL: Descargar MySQL
### 🔧 Configuración Backend
Desde carpeta raíz:
``` Linea de comando
  cd backend
  npm install
  npm install cors
  npm start
```
### 🔧 Configuración Frontend
Desde directorio raiz, en un nuevo terminal de comandos:
``` Linea de comando
  cd frontend
  npm install
  npm run dev
```
### 🖥️ Acceso a la aplicación
  * Abre tu navegador y ve a [localhost:5173](http://localhost:5173).
#### Credenciales de Prueba
  Técnico
   - RUT: 14856536-8
   - Contraseña: clave123

  Supervisor
   - RUT: 12345677-9
   - Contraseña: clave123
     
  Jefe de Turno
   - RUT: 11111111-1
   - Contraseña: clave123

  Administrador
   - RUT: 00000000-0
   - Contraseña: admin

## Notas
   - Actualmente un robot puede tener más de un incidente asignado, pero en el resultado final un robot exclusivamente puede estar en un incidente con estado activo.
   - Las contraseñas actuales no tienen un proceso de encriptado para mejorar la seguridad de estas, pero en un proceso futuro se tiene contemplada esta implementación.
   - En la lógica final, un técnico puede cambiar el estado del robot pero no puede cambiar el estado del incidente.



