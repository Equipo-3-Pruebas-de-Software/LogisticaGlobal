describe('debería clasificar incidente', () => {
  const userInfo = {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
  }

  beforeEach(() => {
    cy.visit('http://3.139.240.205:5173/');
    cy.get('input[id="rut"]').type(userInfo.rut);
    cy.get('input[id="password"]').type(userInfo.clave);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor');
    cy.contains(userInfo.nombre)

    cy.contains('a', 'Incidentes').click();

    cy.get('tbody.content-table tr').then(($rows) => {
      const row = Array.from($rows).find(row => {
        const estado = Cypress.$(row).find('td').eq(3).text().trim().toLowerCase();
        return estado === 'creado';
      });

      if (row) {
        cy.wrap(row).find('button#detalles').click();
      } else {
        throw new Error("No se encontró ninguna fila con estado 'Creado' o 'creado'");
      }
    });
  });

  it('debería clasificar el incidente', () => {
    cy.get('span[id="prioridad"]').type('1');
    cy.get('div[id="gravedad"]').click();
    cy.get('li.p-dropdown-item')
      .contains('Alta')
      .click();

    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).click();
      cy.get(`li.p-dropdown-item`).first().click({ force: true });
    });

    cy.get('.button-container .link-button').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Incidente actualizado correctamente');
  });

  it('debería dar error porque falta el campo prioridad', () => {
    cy.get('div[id="gravedad"]').click();
    cy.get('li.p-dropdown-item')
      .contains('Alta')
      .click();

    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).click();
      cy.get(`li.p-dropdown-item`).first().click({ force: true });
    });

    cy.get('.button-container .link-button').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios');
  });

  it('debería dar error porque falta el campo gravedad', () => {
    cy.get('span[id="prioridad"]').type('1');

    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).click();
      cy.get(`li.p-dropdown-item`).first().click({ force: true });
    });

    cy.get('.button-container .link-button').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios');
  });

  it('debería dar error porque faltan los técnicos', () => {
    cy.get('span[id="prioridad"]').type('1');
    cy.get('div[id="gravedad"]').click();
    cy.get('li.p-dropdown-item')
      .contains('Alta')
      .click();

    cy.get('.button-container .link-button').click();
    cy.get('.msg') 
      .should('be.visible')
      .and('contain', 'Todos los robots deben tener un técnico asignado');
  });
})
