# 📦 Entrega 3 - Pruebas de interfaz con Selenium
## Alcances de la solución implementada
a

## Uso de Selenium
a

## Descripción del trabajo realizado
En esta tercera entrega el objetivo fué integra el uso de selenium en la cobertura de pruebas de nuestra aplicación web, complementando las pruebas mediante interaz gráfica realizadas previamente con Cypress para evaluar y validar interacciones reales del usuario y sus credenciales en el navegador, para esto se realizó:
### Incorporación de selenium e instrucciones mediante código
Se desarrollaron en selenium pruebas de la misma manera a las realizadas con Cypress, enfocadas en validar el flujo de registro de incidentes por parte del jefe de turno, quien sería el primer actor de nuestro sistema de gestión de incidentes. Las pruebas se escribieron en JavaScript mediante las librerias "selenium-webdriver", lo que permite integrar las pruebas al entorno Node.js del proyecto para simular pasos como:
* Inicio de sesión con credenciales.
* Llenado de formulario
* Validación de campos requeridos.
* Envío y recepción de mensajes de confirmación de error.
### Integración de pruebas a  pipeline CI/CD
Ya definidas las pruebas y validadas de manera local, fueron integradas al pipeline de integración continua implementado previamente en Jenkins, lo que significó los siiguientes cambiios en el proyecto:
*  Nuevos Scrips de Selenium en repositorio Github (para establecer pruebas)
*  Actualización de archivo Jenkinsfile para incluir ejecución de pruebas mediante Selenium.
*  Modificación en la configuración de etornos en nuestra máquina virtual AWS.
*  Inegración de notificaciones en Slack, incluyendo los resultados obtenidos por Selenium.


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
jeje pendiente
 
## Entrega 3
jeje por hacer

## Problemas encontrados y soluciones.
d
