describe('Clasificar Incidente', () => {
  const userInfo = {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
  };

  before(() => {
    // Configurar manejo de excepciones no capturadas
    Cypress.on('uncaught:exception', (err) => {
      console.error('Uncaught exception:', err);
      return false;
    });
  });

  beforeEach(() => {
    // 1. Visitar la página con opciones mejoradas
    cy.visit('http://192.168.56.1:5173/', {
      timeout: 60000,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true
    });

    // 2. Login con verificaciones exhaustivas
    cy.get('input[id="rut"]', { timeout: 40000 })
      .should('exist')
      .and('be.visible')
      .type(userInfo.rut, { delay: 100, force: true });

    cy.get('input[id="password"]', { timeout: 40000 })
      .should('exist')
      .and('be.visible')
      .type(userInfo.clave, { delay: 100, force: true });

    cy.get('button[type="submit"]', { timeout: 40000 })
      .should('exist')
      .and('be.visible')
      .and('not.be.disabled')
      .click({ force: true });

    // 3. Verificar login exitoso
    cy.url({ timeout: 60000 }).should('include', '/supervisor');
    cy.contains(userInfo.nombre, { timeout: 40000 })
      .should('exist')
      .and('be.visible');

    // 4. Navegar a Incidentes con verificación de carga
    cy.contains('a', 'Incidentes', { timeout: 40000 })
      .should('exist')
      .and('be.visible')
      .click({ force: true });

    // 5. Esperar y verificar la tabla de incidentes
    const verifyAndOpenIncident = () => {
      cy.get('tbody.content-table', { timeout: 60000 })
        .should('exist')
        .find('tr')
        .should('have.length.gt', 0)
        .then(($rows) => {
          const createdRow = Array.from($rows).find(row => {
            const estado = Cypress.$(row).find('td').eq(3).text().trim().toLowerCase();
            return estado === 'creado';
          });

          if (createdRow) {
            cy.wrap(createdRow).find('button#detalles')
              .should('exist')
              .and('be.visible')
              .click({ force: true, multiple: true });

            // 6. Verificación exhaustiva del modal
            cy.get('body').then(($body) => {
              if ($body.find('.p-dialog').length === 0) {
                cy.log('Modal no apareció después del primer click, intentando nuevamente...');
                cy.wrap(createdRow).find('button#detalles')
                  .click({ force: true, multiple: true });
              }
            });

            // Esperar y verificar el modal con múltiples condiciones
            cy.get('.p-dialog', { timeout: 40000 })
              .should('exist')
              .and('be.visible')
              .within(() => {
                cy.get('.p-dialog-header', { timeout: 20000 })
                  .should('exist')
                  .and('be.visible')
                  .and('contain', 'Detalles del Incidente');
                cy.get('.p-dialog-content', { timeout: 20000 })
                  .should('exist')
                  .and('be.visible');
              });
          } else {
            cy.log('No hay incidentes en estado "Creado", creando uno...');
            cy.exec('npm run create-test-incident', { timeout: 15000 })
              .then(() => {
                cy.reload();
                verifyAndOpenIncident(); // Llamada recursiva después de crear incidente
              });
          }
        });
    };

    verifyAndOpenIncident();
  });

  // [Resto del código de los tests permanece igual pero con los timeouts aumentados]
  const selectFromDropdown = (selector, optionText) => {
    cy.get(selector)
      .should('exist')
      .and('be.visible')
      .click({ force: true });
      
    cy.get('div.p-dropdown-panel', { timeout: 30000 })
      .should('exist')
      .and('be.visible')
      .find('li.p-dropdown-item')
      .contains(optionText)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  };

  it('debería clasificar el incidente correctamente', () => {
    cy.get('span[id="prioridad"]', { timeout: 30000 })
      .should('exist')
      .and('be.visible')
      .and('not.be.disabled')
      .clear()
      .type('1', { delay: 150, force: true });
    
    selectFromDropdown('div[id="gravedad"]', 'Alta');

    cy.get('.robot-container', { timeout: 30000 })
      .should('have.length.gt', 0)
      .each(($robot) => {
        cy.wrap($robot)
          .should('be.visible')
          .click({ force: true });
          
        cy.get('div.p-dropdown-panel', { timeout: 30000 })
          .should('be.visible')
          .find('li.p-dropdown-item:visible')
          .first()
          .scrollIntoView()
          .click({ force: true });
      });

    cy.get('.button-container .link-button', { timeout: 30000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    
    cy.get('.p-inline-message-success', { timeout: 40000 })
      .should('exist')
      .and('be.visible')
      .and('contain', 'Incidente actualizado correctamente');
  });

  // [Resto de los tests permanecen con las mismas mejoras]
  it('debería mostrar error cuando falta el campo prioridad', () => {
    selectFromDropdown('div[id="gravedad"]', 'Alta');

    cy.get('.robot-container')
      .should('have.length.gt', 0)
      .each(($robot) => {
        cy.wrap($robot).click({ force: true });
        cy.get('li.p-dropdown-item:visible').first().click({ force: true });
      });

    cy.get('.button-container .link-button').click();
    cy.get('.p-inline-message-error')
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios');
  });

  it('debería mostrar error cuando falta el campo gravedad', () => {
    cy.get('span[id="prioridad"]')
      .should('be.visible')
      .clear()
      .type('1', { delay: 100 });

    cy.get('.robot-container')
      .should('have.length.gt', 0)
      .each(($robot) => {
        cy.wrap($robot).click({ force: true });
        cy.get('li.p-dropdown-item:visible').first().click({ force: true });
      });

    cy.get('.button-container .link-button').click();
    cy.get('.p-inline-message-error')
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios');
  });

  it('debería mostrar error cuando faltan técnicos asignados', () => {
    cy.get('span[id="prioridad"]')
      .should('be.visible')
      .clear()
      .type('1', { delay: 100 });
      
    selectFromDropdown('div[id="gravedad"]', 'Alta');

    cy.get('.button-container .link-button').click();
    cy.get('.p-inline-message-error')
      .should('be.visible')
      .and('contain', 'Todos los robots deben tener un técnico asignado');
  });
});