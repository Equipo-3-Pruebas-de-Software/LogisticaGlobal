describe('Filtrar Incidentes', () => {
  beforeEach(() => {
    cy.visit('http://18.117.154.175:5173/');
    cy.get('input[id="rut"]').type('12345677-9');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor');
    cy.contains('a', 'Incidentes').click();
  });

  it('debería solo ver mis incidentes y verificar botón firmar', () => {
    cy.contains("Mis Incidentes").click();
    cy.get('tbody.content-table tr').each(($row) => {
      cy.wrap($row).find('td:nth-child(7)').within(() => {
        cy.get('button#firmar').should('exist');
      });
    });
  });

  it('debería filtrar por gravedad', () => {
    cy.contains('span', 'Gravedad').click();
    cy.get('li.p-dropdown-item').first().click().then(($firstItem) => {
      const textoPrimerItem = $firstItem.text().trim().toLowerCase();

      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row).find('td').eq(5).invoke('text').then((text) => {
          const textoCelda = text.trim();
          cy.log('Texto en la celda:', textoCelda);
          expect(textoCelda.toLowerCase()).to.equal(textoPrimerItem);
        });
      });
    });
  });

  it('debería filtrar por prioridad', () => {
    cy.contains('span', 'Prioridad').click();
    cy.get('li.p-dropdown-item').first().click().then(($firstItem) => {
      const textoPrimerItem = Number($firstItem.text().trim());

      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row).find('td').eq(4).invoke('text').then((text) => {
          const textoCelda = Number(text.trim());
          cy.log('Texto en la celda:', textoCelda);
          expect(textoCelda).to.equal(textoPrimerItem);
        });
      });
    });
  });

  it('debería filtrar por estado', () => {
    cy.contains('span', 'Estado').click();
    cy.get('li.p-dropdown-item').first().click().then(($firstItem) => {
      const textoPrimerItem = $firstItem.text().trim().toLowerCase();

      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row).find('td').eq(3).invoke('text').then((text) => {
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
