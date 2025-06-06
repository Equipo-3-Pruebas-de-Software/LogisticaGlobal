describe('Filtrar Técnicos', () => {
  beforeEach(() => {
    cy.visit('http://3.139.240.205:5173/');
    cy.get('input[id="rut"]').type('12345677-9');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor');
    cy.contains('a', 'Técnicos').click();
  });

  it('debería filtrar por disponibilidad', () => {
    cy.contains('span', 'Disponibilidad').click();
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

  it('debería filtrar por búsqueda en cualquier columna', () => {
  const textoBusqueda = "Gonzalez";
  cy.get('input[id="busqueda"]').type(textoBusqueda);
  cy.get('tbody.content-table tr').each(($row) => {
    let textoEncontrado = false;
    cy.wrap($row).find('td').each(($cell) => {
      cy.wrap($cell).invoke('text').then((text) => {
        const textoCelda = text.trim().toLowerCase();
        cy.log('Texto en la celda:', textoCelda);
        if (textoCelda.includes(textoBusqueda.toLowerCase())) {
          textoEncontrado = true;
        }
      });
    }).then(() => {
      expect(textoEncontrado).to.be.true;
    });
  });
});
})
