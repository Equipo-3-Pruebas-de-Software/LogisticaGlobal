# 📦 Entrega 3 - Pruebas de interfaz con Selenium
## Alcances de la solución implementada
Durante el desarrollo del proyecto se implementaron las siguientes vistas y funcionalidades:
### Vista de administrador:
* Dashboard con información de incidentes y robots.
* Agregar, eliminar y actualizar funcionarios (se actualiza contraseña y para supervisor tambien firma).
* Agregar, eliminar y actualizar robots (se actualiza lugar de trabajo).
* Ver la informacion de robots y tecnicos.

### Vista de Supervisor:
* Dashboard con información de incidentes y robots (el mismo de la vista de administrador).
* Definir gravedad, prioridad y asignar técnicos a un incidente.
* Firmar un incidente (cuando todos los tecnicos terminaron su trabajo asignado en este).
* Ver el estado de los robots.
* Ver la disponibilidad de los técnicos.

### Vista de Jefe de Turno:
* Crear nuevos incidentes.

### Vista de Técnico:
* Ver los robots asignados y reparados
* Subir la descripción del trabajo realizado en un robot.

### CI/CD
Se implemento un pipeline CI/CD con jenkins que: 
* Clona el repositorio desde github.
* Configura el entorno de la máquina virtual
* Levanta los 3 dockers (Backend, Frontend y Base de Datos)
* Ejecuta las pruebas end-to-end de cypress y selenium.

## Uso de Selenium
Mediante el uso de 2 códigos de testing en selenium se realizaron pruebas similares a las que se realizaron con cypress, a continuación se adjunta una imagen con un fragmento de la consola de jenkins, la cual nos indica el resultado de ejecutar la prueba de create-new-incident.js.
![Resultado del testing create-new-incident.js](https://i.ibb.co/NgywRM1c/image.png)

## Descripción del trabajo realizado
En esta tercera entrega el objetivo fué integra el uso de selenium en la cobertura de pruebas de nuestra aplicación web, complementando las pruebas mediante interfaz gráfica realizadas previamente con Cypress para evaluar y validar interacciones reales del usuario y sus credenciales en el navegador. para esto se realizó:
### Incorporación de selenium e instrucciones mediante código
Se desarrollaron en selenium pruebas de la misma manera a las realizadas con Cypress, enfocadas en validar el flujo de registro de incidentes por parte del jefe de turno, quien sería el primer actor de nuestro sistema de gestión de incidentes. Las pruebas se escribieron en JavaScript mediante las librerias "selenium-webdriver", lo que permite integrar las pruebas al entorno Node.js del proyecto para simular pasos como:
* Inicio de sesión con credenciales.
* Llenado de formulario
* Validación de campos requeridos.
* Envío y recepción de mensajes de confirmación de error.
### Integración de pruebas a  pipeline CI/CD
Ya definidas las pruebas y validadas de manera local, fueron integradas al pipeline de integración continua implementado previamente en Jenkins, lo que significó los siguientes cambios en el proyecto:
*  Nuevos Scrips de Selenium en repositorio Github (para establecer pruebas)
*  Actualización de archivo Jenkinsfile para incluir ejecución de pruebas mediante Selenium.
*  Modificación en la configuración de etornos en nuestra máquina virtual AWS.
*  Integración de notificaciones en Slack, incluyendo los resultados obtenidos por Selenium.

### Nuevos avances en la aplicación
También se implementaron las siguientes mejoras en la aplicación:
* Mejora de _bugs_ visuales
* Mejora de Dashboard Administrador (Reportes)
* Mejora de Dashboard Supervisor (Reportes)
* Refactor de código (borrar principalmente los console.log())

## Proyecto, paso a paso.
### Pasos previos: Conformación del Equipo y elección del Tema
El inicio del proyecto comenzó con la integración del equipo: se formó a partir de dos parejas que ya habían trabajado juntas previamente en la Tarea 1. Cuando se publicaron los grupos, lo primero que se hizo fue establecer comunicación entre ambas parejas a través de Slack, lo que permitió una coordinación rápida y organizada desde el principio.

Posteriormente, se procedió a elegir uno de los cuatro temas propuestos por la asignatura. El equipo decidió trabajar con el proyecto titulado “LogisticaGlobal.com: Gestión de Incidentes Robóticos en Warehouse”, ya que resultaba interesante desde el punto de vista del problema a resolver y, al mismo tiempo, abordable considerando los conocimientos y habilidades de los integrantes. La elección también se fundamentó en que este tema permitía poner un mayor foco en herramientas de testing por sobre las tecnologías de desarrollo, lo cual era coherente con los objetivos del curso, centrado en la validación y verificación de software.

En términos generales, el proyecto consistía en desarrollar una aplicación web para reemplazar el sistema manual de registro de incidentes utilizado actualmente en los almacenes automatizados de LogisticaGlobal.com. En el proceso actual, los supervisores deben gestionar los incidentes mediante documentos físicos y digitales, lo que genera problemas de trazabilidad, errores frecuentes y sobrecarga de trabajo. La solución propuesta buscaba centralizar el registro, clasificación y seguimiento de los incidentes, además de automatizar la generación de reportes mensuales y anuales. Se definieron distintos tipos de usuario (supervisor, técnico y administrador) y se establecieron los requerimientos funcionales del sistema a través de la Tarea 2.

Para el desarrollo, el equipo acordó utilizar React, Node.js, Express y MySQL, tecnologías ya conocidas por los integrantes. Como plataforma de despliegue se optó por AWS, tanto por sus capacidades como por el interés en aprender a utilizarla. En cuanto a las pruebas automatizadas, se eligió Cypress por su integración sencilla con React y su efectividad en pruebas end-to-end.

Con todo lo anterior definido, el equipo comenzó la preparación para la primera entrega del proyecto.
### Entrega 1
En la primera entrega, el equipo se enfocó en abordar los requisitos fundamentales del sistema relacionados con la gestión de incidentes robóticos. Los puntos principales considerados fueron:

1. Registro de incidentes.
2. Asociación de un incidente a múltiples robots.
3. Visualización de incidentes.
4. Búsqueda y filtrado de registros.
5. Clasificación de incidentes.
6. Asignación de técnicos.
7. Resolución de incidentes.
8. Descripción del trabajo realizado por los técnicos.
9. Trazabilidad completa del estado con marcas de tiempo.
10. Autenticación de usuarios.

El equipo implementó el flujo básico completo para el manejo de incidentes, que abarcó desde la creación y clasificación de un incidente, la asignación de técnicos para su resolución, hasta la actualización del estado una vez resuelto. Esto permitió que el sistema cumpliera con las funcionalidades mínimas necesarias para registrar y dar seguimiento a los incidentes. Es importante notar que, si bien el requisito de la entrega era implementar un CRUD completo, se omitió la operación Delete, ya que se consideró que la lógica de negocio debía mantener la trazabilidad, por lo que el Delete era innecesario.

En cuanto a las pruebas, se desarrollaron casos básicos automatizados con Cypress, enfocándose en escenarios esenciales como la creación de incidentes, su clasificación y la asignación de técnicos. Estas pruebas sirvieron para validar que el flujo principal funcionara correctamente y que los componentes clave estuvieran integrados de manera adecuada.

Además, se integró Slack con GitHub y Jira para la correcta organización del equipo. Finalmente, el equipo preparó la cápsula explicativa que se pedía en los requerimientos de la entrega, además de preparar todo lo necesario para la presentación en clases, la cual fue un éxito. Así, se dio por finalizada la primera etapa del proyecto, estableciendo una base sólida para avanzar en las siguientes entregas.

### Entrega 2
En la segunda entrega, el equipo avanzó tanto en el desarrollo de nuevas funcionalidades como en la automatización del despliegue del sistema. Los principales requisitos abordados en esta etapa fueron:

1. Mejorar el diseño responsive en toda la aplicación para una visualización adecuada desde distintos dispositivos.
2. Incorporar una vista dedicada para el perfil de administrador, con acceso a funcionalidades específicas de gestión.
3. Permitir el registro de nuevos funcionarios en el sistema.
4. Habilitar la edición y eliminación de funcionarios y robots.
5. Mejorar la interfaz y usabilidad de las vistas de supervisor y técnico.

El foco central de esta entrega fue la implementación de un pipeline de integración continua utilizando Jenkins. Para esto, se construyeron imágenes de la aplicación con Docker, que fueron almacenadas en Docker Hub. Cada vez que Jenkins ejecuta el pipeline, estas imágenes se actualizan automáticamente y se despliegan en AWS, asegurando así un flujo de publicación continuo y controlado. Además, se intró Jenkins con Slack.

### Entrega 2
En la segunda entrega, el equipo avanzó tanto en el desarrollo de nuevas funcionalidades como en la automatización del despliegue del sistema. Los principales requisitos abordados en esta etapa fueron:

1. Mejorar el diseño responsive en toda la aplicación para una visualización adecuada desde distintos dispositivos.
2. Incorporar una vista dedicada para el perfil de administrador, con acceso a funcionalidades específicas de gestión.
3. Permitir el registro de nuevos funcionarios en el sistema.
4. Habilitar la edición y eliminación de funcionarios y robots.
5. Mejorar la interfaz y usabilidad de las vistas de supervisor y técnico.

El foco central de esta entrega fue la implementación de un pipeline de integración continua utilizando Jenkins. Para esto, se construyeron imágenes de la aplicación con Docker, que fueron almacenadas en Docker Hub. Cada vez que Jenkins ejecuta el pipeline, estas imágenes se actualizan automáticamente y se despliegan en AWS, asegurando así un flujo de publicación continuo y controlado.

Tal como se solicitaba en los requerimientos, el equipo preparó una cápsula explicativa que resumía los avances realizados. Con estos desarrollos, el sistema alcanzó un mayor grado de madurez técnica, permitiendo avanzar hacia una versión más robusta y cercana al producto final.
 
### Entrega 3
En la tercera entrega, el equipo se enfocó en afinar aspectos tanto funcionales como técnicos del sistema, consolidando el trabajo realizado en las entregas previas y preparando el estado final del producto. Esta etapa se centró principalmente en mejoras visuales, optimización del código e integración de nuevas herramientas para asegurar la calidad del software. Las principales tareas abordadas en esta entrega fueron:

1. Mejora de _bugs_ visuales
2. Mejora de Dashboard Administrador (Reportes)
3. Mejora de Dashboard Supervisor (Reportes)
4. Refactor de código (borrar principalmente los console.log())

Además, se implementó Selenium en la pipeline de Jenkins. Esta herramienta complementa las pruebas end-to-end previamente desarrolladas con Cypress, lo que permitió aumentar la cobertura y robustez del sistema, al validar tanto flujos críticos como escenarios de interacción en el navegador desde una perspectiva más completa.

## Problemas encontrados y soluciones
### 1. Carga académica de fin de semestre
Durante el cierre del semestre, el equipo enfrentó una alta carga académica debido a la concentración de entregas y certámenes en otros ramos, lo que dificultó la disponibilidad de tiempo para avanzar en el proyecto de manera sostenida.

La solución para mitigar este problema se basó en la planificación anticipada de las tareas, utilizando Jira como herramienta de gestión y una carta Gantt para visualizar la distribución temporal del trabajo. Esta estrategia permitió organizar las actividades de forma más eficiente, asignar responsabilidades con claridad y priorizar las tareas clave. Gracias a esta planificación, el equipo logró mantener un buen ritmo de trabajo y cumplir con los plazos establecidos, incluso en un periodo marcado por una alta carga académica.

### 2. Dificultad para acceder al HTML al usar una biblioteca de componentes
El uso de una biblioteca de componentes facilitó el desarrollo visual de la aplicación, ya que permitía reutilizar elementos con una sola línea de código. Sin embargo, esto dificultó la escritura de pruebas automatizadas con Selenium, ya que no se tiene acceso directo al HTML subyacente del componente, lo que impide identificar fácilmente los elementos del DOM necesarios para las pruebas.

La solución consistió en utilizar la consola del desarrollador del navegador para inspeccionar manualmente el HTML generado por cada componente. De esta forma, el equipo pudo identificar los selectores adecuados y escribir las pruebas correspondientes en Selenium, aunque el proceso fue más lento y detallado. Cabe destacar que esta dificultad no se presentó al usar Cypress, donde las pruebas resultaron más fluidas. Una posible explicación es que Cypress presenta una integración más amigable con aplicaciones desarrolladas en React, lo que facilita la detección y manipulación de los elementos en tiempo de ejecución.

### 3. Fallas en pruebas por carga asíncrona de elementos HTML
Durante la escritura de pruebas automatizadas, algunas fallaban incluso cuando el sistema funcionaba correctamente. Esto se debía a que los elementos HTML aún no estaban disponibles en el DOM al momento en que Selenium intentaba interactuar con ellos, lo que resultaba en falsos negativos.

Para solucionar este problema, se agregaron tiempos de espera (wait) antes de buscar los elementos, permitiendo que el DOM terminara de cargarse antes de ejecutar la interacción. Con este ajuste, las pruebas pudieron ejecutarse de forma más confiable y reflejar correctamente el estado funcional del sistema.

### 4. Resultados incompletos en el log de Jenkins durante las pruebas
Al ejecutar las pruebas automatizadas mediante la pipeline de Jenkins, se detectó que los _logs_ no mostraban los resultados de los tests de forma completa, lo que dificultaba identificar con precisión qué pruebas habían fallado y por qué.

La solución fue agregar _prints_ personalizados dentro de los scripts de prueba, lo que permitió revisar los resultados test por test directamente en el log. Esta estrategia facilitó la identificación de errores específicos y permitió depurar con mayor claridad, compensando así la falta de información detallada en el informe de Jenkins.
