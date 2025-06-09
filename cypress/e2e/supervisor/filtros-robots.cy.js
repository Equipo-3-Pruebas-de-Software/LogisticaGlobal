describe('Filtrar Robots', () => {
  const userCredentials = {
    rut: '12345677-9',
    password: 'clave123'
  };

  before(() => {
    // Manejar excepciones globales no controladas
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('hideOverlaysOnDocumentScrolling')) {
        return false;
      }
      return true;
    });
  });

  beforeEach(() => {
    // Login y navegación a sección Robots
    cy.visit('http://192.168.1.88:5173/');
    cy.get('input[id="rut"]', { timeout: 10000 }).should('be.visible').type(userCredentials.rut);
    cy.get('input[id="password"]').type(userCredentials.password);
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/supervisor');
    cy.contains('a', 'Robots', { timeout: 8000 }).click();

    // Esperar a que la tabla de robots cargue completamente
    cy.get('tbody.content-table', { timeout: 15000 }).should('exist');
    cy.get('tbody.content-table tr', { timeout: 15000 }).should('have.length.gt', 0);
  });

  it('debería filtrar por estado', () => {
    const estadoColumnIndex = 3; // Asegúrate que este sea el índice correcto (3 = cuarta columna)

    // Abrir dropdown de Estado
    cy.contains('span', 'Estado').click();
    cy.get('li.p-dropdown-item:visible', { timeout: 8000 }).first().as('firstFilterOption');

    cy.get('@firstFilterOption').then(($option) => {
      const filterValue = $option.text().trim().toLowerCase();
      cy.get('@firstFilterOption').click();

      // Esperar a que se aplique el filtro
      cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist');

      // Verificar que todas las filas coincidan con el filtro
      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row)
          .find(`td:nth-child(${estadoColumnIndex})`)
          .invoke('text')
          .then((text) => {
            expect(text.trim().toLowerCase()).to.equal(filterValue);
          });
      });
    });
  });

  it('debería filtrar por búsqueda', () => {
    const searchText = "zona de";
    const searchColumnIndex = 2; // Asegúrate que este sea el índice correcto (2 = tercera columna)

    cy.get('input[id="busqueda"]', { timeout: 8000 }).should('be.visible').type(searchText);

    // Esperar a que se aplique el filtro
    cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist');

    // Verificar que al menos haya un resultado
    cy.get('tbody.content-table tr', { timeout: 8000 }).should('have.length.gt', 0);

    // Verificar que las celdas contengan el texto buscado
    cy.get('tbody.content-table tr').each(($row) => {
      cy.wrap($row)
        .find(`td:nth-child(${searchColumnIndex})`)
        .invoke('text')
        .then((text) => {
          expect(text.trim().toLowerCase()).to.include(searchText);
        });
    });
  });
});
