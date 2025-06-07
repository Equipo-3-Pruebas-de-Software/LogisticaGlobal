describe('Filtrar Robots', () => {
  beforeEach(() => {
    cy.visit('http://3.146.65.234:5173/');
    cy.get('input[id="rut"]').type('12345677-9');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor');
    cy.contains('a', 'Robots').click();
  });

  it('debería filtrar por estado', () => {
    cy.contains('span', 'Estado').click();
    cy.get('li.p-dropdown-item').first().click().then(($firstItem) => {
      const textoPrimerItem = $firstItem.text().trim().toLowerCase();

      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row).find('td').eq(2).invoke('text').then((text) => {
          const textoCelda = text.trim();
          cy.log('Texto en la celda:', textoCelda);
          expect(textoCelda.toLowerCase()).to.equal(textoPrimerItem);
        });
      });
    });
  });

  it('debería filtrar por búsqueda', () => {
    const textoBusqueda = "zona de"
    cy.get('input[id="busqueda"]').type(textoBusqueda);
    cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row).find('td').eq(1).invoke('text').then((text) => {
          const textoCelda = text.trim();
          cy.log('Texto en la celda:', textoCelda);
          expect(textoCelda.toLowerCase()).to.include(textoBusqueda);
        });
      });
  });
})
