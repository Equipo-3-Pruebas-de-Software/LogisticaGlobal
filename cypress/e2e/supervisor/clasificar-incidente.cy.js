describe('Clasificar Incidente', () => {
  const userInfo = {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
  };

  before(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('hideOverlaysOnDocumentScrolling')) {
        return false;
      }
      return true;
    });
  });

  beforeEach(() => {
    cy.visit('http://192.168.56.1:5173/', {
      onBeforeLoad(win) {
        // Deshabilitar errores de overlay que puedan interferir
        win.console.log = () => {};
      }
    });
    
    // Login con verificación mejorada
    cy.get('input[id="rut"]', { timeout: 30000 })
      .should('be.visible')
      .type(userInfo.rut, { delay: 100 });
      
    cy.get('input[id="password"]')
      .should('be.visible')
      .type(userInfo.clave, { delay: 100 });
      
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();

    // Verificar login con múltiples condiciones
    cy.url({ timeout: 30000 }).should('include', '/supervisor');
    cy.contains(userInfo.nombre, { timeout: 30000 }).should('be.visible');

    // Navegar a Incidentes con verificación de carga
    cy.contains('a', 'Incidentes', { timeout: 30000 })
      .should('be.visible')
      .click();

    // Esperar carga de tabla con verificación de datos
    cy.get('tbody.content-table', { timeout: 40000 })
      .should('exist')
      .find('tr')
      .should('have.length.gt', 0);

    // Función para manejar la apertura del modal
    const openIncidentModal = () => {
      cy.get('tbody.content-table tr', { timeout: 30000 }).then(($rows) => {
        const createdRow = Array.from($rows).find(row => {
          const estado = Cypress.$(row).find('td').eq(3).text().trim().toLowerCase();
          return estado === 'creado';
        });

        if (createdRow) {
          cy.wrap(createdRow).find('button#detalles')
            .should('be.visible')
            .click({ force: true });
            
          // Verificación en profundidad del modal
          cy.get('body').then(($body) => {
            if ($body.find('.p-dialog').length === 0) {
              cy.log('Modal no apareció, intentando nuevamente...');
              cy.wrap(createdRow).find('button#detalles')
                .should('be.visible')
                .click({ force: true });
            }
          });
          
          // Verificaciones exhaustivas del modal
          cy.get('.p-dialog', { timeout: 30000 })
            .should('be.visible')
            .within(() => {
              cy.get('.p-dialog-header').should('contain', 'Detalles del Incidente');
              cy.get('.p-dialog-content').should('be.visible');
            });
        } else {
          cy.log('No hay incidentes en estado "Creado", creando uno...');
          cy.exec('npm run create-test-incident', { timeout: 10000 }).then(() => {
            cy.reload();
            cy.get('tbody.content-table tr', { timeout: 40000 })
              .should('have.length.gt', 0)
              .first()
              .find('button#detalles')
              .click({ force: true });
              
            cy.get('.p-dialog', { timeout: 30000 })
              .should('be.visible')
              .within(() => {
                cy.get('.p-dialog-header').should('contain', 'Detalles del Incidente');
                cy.get('.p-dialog-content').should('be.visible');
              });
          });
        }
      });
    };

    openIncidentModal();
  });

  // Función mejorada para selección en dropdown
  const selectFromDropdown = (selector, optionText) => {
    cy.get(selector)
      .should('be.visible')
      .click({ force: true });
      
    cy.get('div.p-dropdown-panel', { timeout: 20000 })
      .should('be.visible')
      .find('li.p-dropdown-item')
      .contains(optionText)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  };

  it('debería clasificar el incidente correctamente', () => {
    // Prioridad con verificación de entrada
    cy.get('span[id="prioridad"]')
      .should('be.visible')
      .and('not.be.disabled')
      .clear()
      .type('1', { delay: 150 });
    
    // Gravedad con verificación de selección
    selectFromDropdown('div[id="gravedad"]', 'Alta');

    // Asignación de técnicos con verificación
    cy.get('.robot-container')
      .should('have.length.gt', 0)
      .each(($robot, index) => {
        cy.wrap($robot)
          .should('be.visible')
          .click({ force: true });
          
        cy.get('div.p-dropdown-panel', { timeout: 20000 })
          .should('be.visible')
          .find('li.p-dropdown-item:visible')
          .first()
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
      });

    // Envío del formulario con verificación de estado
    cy.get('.button-container .link-button')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    
    // Verificación de éxito con múltiples condiciones
    cy.get('.p-inline-message-success', { timeout: 30000 })
      .should('be.visible')
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