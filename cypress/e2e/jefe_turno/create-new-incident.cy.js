describe('Crear Incidentes', () => {
  beforeEach(() => {
    cy.visit('http://host.docker.internal:5173/');
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

  it('debería poder crear un nuevo incidente', () => {
    cy.get('input[id="lugar"]').type('Pasillo 3');
    cy.get('textarea[id="descripcion"]').type('Los robots chocaron. A uno de ellos se le salió la rueda izquierda, al otro se le rompió el brazo mecánico. Dejaron caer mercancías frágiles.');
    cy.get('div[id="robots"]').click();
    cy.get('li.p-multiselect-item')
      .first()
      .click(); 

    cy.get('li.p-multiselect-item')
      .last()
      .click(); 

    cy.get('body').click(0, 0);

    cy.get('button[type="submit"]').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Incidente creado');

    cerrarSesion();
  });

  it('debería dar error porque falta el campo de lugar', () => {
    cy.get('textarea[id="descripcion"]').type("Durante la manipulación de paquetes frágiles, el robot dejó caer una caja, resultando en daños en el contenido. Revisar sensores.");
    cy.get('div[id="robots"]').click();
  
    cy.get('li.p-multiselect-item')
      .first()
      .click();

    cy.get('body').click(0, 0);

    cy.get('button[type="submit"]').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');

    cerrarSesion();
  });

  it('debería dar error porque falta el campo de descripción', () => {
    cy.get('input[id="lugar"]').type('Pasillo Norte');
    cy.get('div[id="robots"]').click();

    cy.get('li.p-multiselect-item')
      .first()
      .click(); 

    cy.get('body').click(0, 0);

    cy.get('button[type="submit"]').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');
  });

  it('debería dar error porque no se seleccionaron robots', () => {
    cy.get('input[id="lugar"]').type('Pasillo Este');
    cy.get('textarea[id="descripcion"]').type("El robot se detuvo repentinamente en la zona de carga, causando un retraso en la operación. Se recomienda revisar el estado del robot y reiniciar su sistema.");
    
    cy.get('body').click(0, 0);
    
    cy.get('button[type="submit"]').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');

    cerrarSesion();
  });

});