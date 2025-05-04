describe('Crear Incidentes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.get('input[id="rut"]').type('11111111-1');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/jefe_turno');
  });

  const cerrarSesion = () => {
    cy.get('a').contains('Cerrar sesión').click(); // Ajusta el selector si es diferente
    cy.url().should('include', '/'); // Verifica que se redirige a la página de inicio (o login)
    cy.get('input[id="rut"]').should('be.visible'); // Verifica que el campo de RUT esté visible (u otro elemento de la página de inicio)
  };

  it('debería poder crear un nuevo incidente', () => {
    cy.get('input[id="lugar"]').type('Pasillo Sur');
    cy.get('textarea[id="descripcion"]').type('Los robots chocaron entre sí, causando daños en la mercancía. Al robot 2 se le salió el sensor de proximidad y al robot 3 se le salió la rueda del lado izquierdo. El robot 1 no presenta daños visibles, pero no se mueve. Se recomienda revisar los sensores de todos los robots involucrados en el incidente.');
    cy.get('div[id="robots"]').click();
    cy.get('li.p-multiselect-item')
      .contains('Robot 1')
      .click(); // Haz clic en el li que contiene "Robot 1"

    cy.get('li.p-multiselect-item')
      .contains('Robot 2')
      .click(); // Haz clic en el li que contiene "Robot 2"

    cy.get('li.p-multiselect-item')
      .contains('Robot 3')
      .click(); // Haz clic en el li que contiene "Robot 3"
    cy.get('button[type="submit"]').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Incidente creado');

    cerrarSesion();
  });


  it('debería dar error porque falta el campo de lugar', () => {
    cy.get('textarea[id="descripcion"]').type("Durante la manipulación de paquetes frágiles, el robot 6 dejó caer una caja, resultando en daños en el contenido. ");
    cy.get('div[id="robots"]').click();
  
    cy.get('li.p-multiselect-item')
      .contains('Robot 6')
      .click();

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
      .contains('Robot 5')
      .click(); 

    cy.get('button[type="submit"]').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');
  });

  it('debería dar error porque no se seleccionaron robots', () => {
    cy.get('input[id="lugar"]').type('Pasillo Este');
    cy.get('textarea[id="descripcion"]').type("El robot 4 se detuvo repentinamente en la zona de carga, causando un retraso en la operación. Se recomienda revisar el estado del robot y reiniciar su sistema.");
    cy.get('button[type="submit"]').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Todos los campos son obligatorios');

    cerrarSesion();
  });

});