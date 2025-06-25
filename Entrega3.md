# 📦 Entrega 3 - Pruebas de interfaz con Selenium
## Alcances de la solución implementada
a

## Uso de Selenium
a

## Descripción del trabajo realizado
b

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

Finalmente, el equipo preparó la cápsula explicativa que se pedía en los requerimientos de la entrega, además de preparar todo lo necesario para la presentación en clases, la cual fue un éxito. Así, se dio por finalizada la primera etapa del proyecto, estableciendo una base sólida para avanzar en las siguientes entregas.

## Entrega 2
En la segunda entrega, el equipo avanzó tanto en el desarrollo de nuevas funcionalidades como en la automatización del despliegue del sistema. Los principales requisitos abordados en esta etapa fueron:

1. Mejorar el diseño responsive en toda la aplicación para una visualización adecuada desde distintos dispositivos.
2. Incorporar una vista dedicada para el perfil de administrador, con acceso a funcionalidades específicas de gestión.
3. Permitir el registro de nuevos funcionarios en el sistema.
4. Habilitar la edición y eliminación de funcionarios y robots.
5. Mejorar la interfaz y usabilidad de las vistas de supervisor y técnico.

El foco central de esta entrega fue la implementación de un pipeline de integración continua utilizando Jenkins. Para esto, se construyeron imágenes de la aplicación con Docker, que fueron almacenadas en Docker Hub. Cada vez que Jenkins ejecuta el pipeline, estas imágenes se actualizan automáticamente y se despliegan en AWS, asegurando así un flujo de publicación continuo y controlado.

Tal como se solicitaba en los requerimientos, el equipo preparó una cápsula explicativa que resumía los avances realizados. Con estos desarrollos, el sistema alcanzó un mayor grado de madurez técnica, permitiendo avanzar hacia una versión más robusta y cercana al producto final.

## Entrega 3
jeje por hacer

## Problemas encontrados y soluciones.
d
