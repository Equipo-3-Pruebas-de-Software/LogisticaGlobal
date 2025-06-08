describe('Crear Incidentes', () => {
  beforeEach(() => {
    cy.visit('http://192.168.56.1:5173/');
    cy.get('input[id="rut"]').type('11111111-1');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/jefe_turno');
  });

  const cerrarSesion = () => {
    cy.get('a').contains('Cerrar sesión').click(); 
    cy.url().should('include', '/'); 
    cy.get('input[id="rut"]').should('be.visible'); 
  };

  const seleccionarRobots = () => {
    // Esperar a que el dropdown esté disponible
    cy.get('div[id="robots"]').should('be.visible').click();
    
    // Esperar a que los items del multiselect estén cargados
    cy.get('li.p-multiselect-item', { timeout: 10000 })
      .should('have.length.gt', 0)
      .first()
      .click();

    cy.get('li.p-multiselect-item')
      .last()
      .click();

    // Cerrar el dropdown haciendo clic fuera
    cy.get('body').click(0, 0);
  };

  it('debería poder crear un nuevo incidente', () => {
    cy.get('input[id="lugar"]').type('Pasillo 3');
    cy.get('textarea[id="descripcion"]').type('Los robots chocaron. A uno de ellos se le salió la rueda izquierda, al otro se le rompió el brazo mecánico. Dejaron caer mercancías frágiles.');
    
    seleccionarRobots();

    cy.get('button[type="submit"]').click();
    cy.get('.msg', { timeout: 10000 }) 
      .should('be.visible')
      .and('contain', 'Incidente creado');

    cerrarSesion();
  });

  it('debería dar error porque falta el campo de lugar', () => {
    cy.get('textarea[id="descripcion"]').type("Durante la manipulación de paquetes frágiles, el robot dejó caer una caja, resultando en daños en el contenido. Revisar sensores.");
    
    seleccionarRobots();

    cy.get('button[type="submit"]').click();
    cy.get('.msg', { timeout: 10000 }) 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');

    cerrarSesion();
  });

  it('debería dar error porque falta el campo de descripción', () => {
    cy.get('input[id="lugar"]').type('Pasillo Norte');
    
    seleccionarRobots();

    cy.get('button[type="submit"]').click();
    cy.get('.msg', { timeout: 10000 }) 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');
      
    cerrarSesion();
  });

  it('debería dar error porque no se seleccionaron robots', () => {
    cy.get('input[id="lugar"]').type('Pasillo Este');
    cy.get('textarea[id="descripcion"]').type("El robot se detuvo repentinamente en la zona de carga, causando un retraso en la operación. Se recomienda revisar el estado del robot y reiniciar su sistema.");
    
    cy.get('button[type="submit"]').click();
    cy.get('.msg', { timeout: 10000 }) 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');

    cerrarSesion();
  });
});