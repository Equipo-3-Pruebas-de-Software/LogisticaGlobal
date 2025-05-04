describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.get('input[id="rut"]').type('12345677-9');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor');
    cy.contains('a', 'Incidentes').click();
  });

  it('debería filtrar por gravedad', () => {
    cy.contains('span', 'Gravedad').click();
    cy.get('li.p-dropdown-item').first().click();
  });

  it('debería filtrar por prioridad', () => {
    cy.contains('span', 'Prioridad').click();
    cy.get('li.p-dropdown-item').first().click();
  });

  it('debería filtrar por estado', () => {
    cy.contains('span', 'Estado').click();
    cy.get('li.p-dropdown-item').contains("técnico asignado").first().click();
  });

  it('debería filtrar por búsqueda', () => {
    cy.get('input[id="busqueda"]').type("Zona de");
  });
})