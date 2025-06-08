describe('Clasificar Incidente', () => {
  const userInfo = {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
  }

  before(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('hideOverlaysOnDocumentScrolling')) {
        return false
      }
      return true
    })
  })

  beforeEach(() => {
    cy.visit('http://192.168.56.1:5173/')
    
    // Login con verificaciones mejoradas
    cy.get('input[id="rut"]', { timeout: 20000 }).should('be.visible').type(userInfo.rut)
    cy.get('input[id="password"]').should('be.visible').type(userInfo.clave)
    cy.get('button[type="submit"]').should('be.visible').click()
    
    // Verificar login con más tolerancia
    cy.url({ timeout: 20000 }).should('include', '/supervisor')
    cy.contains(userInfo.nombre, { timeout: 20000 }).should('be.visible')

    // Navegar a Incidentes con esperas inteligentes
    cy.contains('a', 'Incidentes', { timeout: 20000 }).should('be.visible').click()
    
    // Esperar a la tabla con más condiciones
    cy.get('tbody.content-table', { timeout: 25000 }).should('exist')
    cy.get('tbody.content-table tr', { timeout: 25000 }).should('have.length.gt', 0)

    // Encontrar y manejar incidentes con estado "Creado"
    cy.get('tbody.content-table tr').then(($rows) => {
      const row = Array.from($rows).find(row => {
        const estado = Cypress.$(row).find('td').eq(3).text().trim().toLowerCase()
        return estado === 'creado'
      })

      if (row) {
        cy.wrap(row).find('button#detalles').should('be.visible').click({ force: true })
        
        // Esperar al modal con múltiples condiciones
        cy.get('.p-dialog', { timeout: 20000 }).should('be.visible')
        cy.get('.p-dialog-content', { timeout: 20000 }).should('be.visible')
        cy.get('.p-dialog-title', { timeout: 20000 }).should('contain', 'Detalles del Incidente')
      } else {
        cy.log('No hay incidentes en estado "Creado", creando uno...')
        cy.exec('npm run create-test-incident').then(() => {
          cy.reload()
          cy.get('tbody.content-table tr', { timeout: 25000 }).should('have.length.gt', 0)
          cy.get('tbody.content-table tr').first().find('button#detalles').click({ force: true })
          
          // Esperar al modal después de crear incidente
          cy.get('.p-dialog', { timeout: 20000 }).should('be.visible')
          cy.get('.p-dialog-content', { timeout: 20000 }).should('be.visible')
        })
      }
    })
  })

  // Función auxiliar mejorada para seleccionar en dropdowns
  const selectFromDropdown = (selector, optionText) => {
    cy.get(selector).should('be.visible').click()
    cy.get('div.p-dropdown-panel', { timeout: 15000 })
      .should('be.visible')
      .find('li.p-dropdown-item:visible')
      .contains(optionText)
      .should('be.visible')
      .click()
  }

  it('debería clasificar el incidente correctamente', () => {
    // Prioridad con verificación de campo
    cy.get('span[id="prioridad"]').should('be.visible').and('be.enabled').clear().type('1', { delay: 100 })
    
    // Gravedad con verificación adicional
    selectFromDropdown('div[id="gravedad"]', 'Alta')

    // Asignar técnicos con verificación de contenedores
    cy.get('.robot-container').should('have.length.gt', 0).each(($robotContainer) => {
      cy.wrap($robotContainer).should('be.visible').click()
      cy.get('div.p-dropdown-panel', { timeout: 15000 }).should('be.visible')
      cy.get('li.p-dropdown-item:visible').first().should('be.visible').click()
    })

    // Enviar formulario con verificación de botón
    cy.get('.button-container .link-button')
      .should('be.visible')
      .and('not.be.disabled')
      .click()
    
    // Verificar éxito con múltiples condiciones
    cy.get('.p-inline-message-success', { timeout: 20000 })
      .should('be.visible')
      .and('contain', 'Incidente actualizado correctamente')
  })

  // [Resto de los tests permanecen igual pero con los timeouts aumentados]
  it('debería mostrar error cuando falta el campo prioridad', () => {
    selectFromDropdown('div[id="gravedad"]', 'Alta')

    cy.get('.robot-container').should('have.length.gt', 0).each(($robotContainer) => {
      cy.wrap($robotContainer).should('be.visible').click()
      cy.get('div.p-dropdown-panel', { timeout: 15000 }).should('be.visible')
      cy.get('li.p-dropdown-item:visible').first().should('be.visible').click()
    })

    cy.get('.button-container .link-button')
      .should('be.visible')
      .and('not.be.disabled')
      .click()
    
    cy.get('.p-inline-message-error', { timeout: 20000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando falta el campo gravedad', () => {
    cy.get('span[id="prioridad"]').should('be.visible').and('be.enabled').clear().type('1', { delay: 100 })

    cy.get('.robot-container').should('have.length.gt', 0).each(($robotContainer) => {
      cy.wrap($robotContainer).should('be.visible').click()
      cy.get('div.p-dropdown-panel', { timeout: 15000 }).should('be.visible')
      cy.get('li.p-dropdown-item:visible').first().should('be.visible').click()
    })

    cy.get('.button-container .link-button')
      .should('be.visible')
      .and('not.be.disabled')
      .click()
    
    cy.get('.p-inline-message-error', { timeout: 20000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando faltan técnicos asignados', () => {
    cy.get('span[id="prioridad"]').should('be.visible').and('be.enabled').clear().type('1', { delay: 100 })
    selectFromDropdown('div[id="gravedad"]', 'Alta')

    cy.get('.button-container .link-button')
      .should('be.visible')
      .and('not.be.disabled')
      .click()
    
    cy.get('.p-inline-message-error', { timeout: 20000 })
      .should('be.visible')
      .and('contain', 'Todos los robots deben tener un técnico asignado')
  })
})