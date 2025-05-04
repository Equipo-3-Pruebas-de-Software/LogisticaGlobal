describe('Clasificar Incidente', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.get('input[id="rut"]').type('12345677-9');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor');
  });

  it('debería clasificar el incidente', () => {
    cy.contains('a', 'Incidentes').click();
    cy.get('button[id="detalles"]').first().click();

    cy.get('span[id="prioridad"]').type('1');
    cy.get('div[id="gravedad"]').click();

    cy.get('li.p-dropdown-item')
      .contains('Alta')
      .click();

      const robotIds = [1, 2, 3]; // Reemplaza con los robotIds reales

    robotIds.forEach(robotId => {
      cy.get(`#robot-${robotId}`).click(); // Abre el dropdown del robot

      // Aquí iría el código para seleccionar una opción dentro de este dropdown
      // Por ejemplo:
      // Selecciona la primera opción dentro del dropdown abierto
      cy.get(`li.p-dropdown-item`).first().click({ force: true });

      // (Opcional) Puedes agregar una aserción para verificar la selección
      cy.get(`#robot-${robotId}`).should('not.contain', 'Selecciona técnico')
    });

    cy.get('.button-container .link-button').click();

  });

})