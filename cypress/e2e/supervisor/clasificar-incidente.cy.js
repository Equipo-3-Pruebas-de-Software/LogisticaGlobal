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
    
    // Login mejorado
    cy.get('input[id="rut"]', { timeout: 15000 }).should('be.visible').type(userInfo.rut)
    cy.get('input[id="password"]').should('be.visible').type(userInfo.clave)
    cy.get('button[type="submit"]').should('be.visible').click()
    
    // Verificar login
    cy.url({ timeout: 15000 }).should('include', '/supervisor')
    cy.contains(userInfo.nombre, { timeout: 15000 }).should('be.visible')

    // Navegar a Incidentes con más robustez
    cy.contains('a', 'Incidentes', { timeout: 15000 }).should('be.visible').click()
    
    // Esperar a la tabla con más verificaciones
    cy.get('tbody.content-table', { timeout: 20000 }).should('exist')
    cy.get('tbody.content-table tr', { timeout: 20000 }).should('have.length.gt', 0)

    // Encontrar incidente con estado "Creado"
    cy.get('tbody.content-table tr').then(($rows) => {
      const row = Array.from($rows).find(row => {
        const estado = Cypress.$(row).find('td').eq(3).text().trim().toLowerCase()
        return estado === 'creado'
      })

      if (row) {
        cy.wrap(row).find('button#detalles').should('be.visible').click({ force: true })
      } else {
        cy.log('No hay incidentes en estado "Creado", creando uno...')
        cy.exec('npm run create-test-incident').then(() => {
          cy.reload()
          cy.get('tbody.content-table tr', { timeout: 20000 }).first().find('button#detalles').click({ force: true })
        })
      }
    })

    // Esperar a que el modal de detalles esté completamente cargado
    cy.get('.p-dialog-content', { timeout: 15000 }).should('be.visible')
  })

  // Función auxiliar para seleccionar en dropdowns
  const selectFromDropdown = (selector, optionText) => {
    cy.get(selector).should('be.visible').click()
    cy.get('div.p-dropdown-panel', { timeout: 10000 }).should('be.visible')
    cy.get('li.p-dropdown-item:visible').contains(optionText).should('be.visible').click()
  }

  it('debería clasificar el incidente correctamente', () => {
    // Prioridad
    cy.get('span[id="prioridad"]').should('be.visible').clear().type('1', { delay: 100 })
    
    // Gravedad
    selectFromDropdown('div[id="gravedad"]', 'Alta')

    // Asignar técnicos
    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).should('be.visible').click()
      cy.get('div.p-dropdown-panel', { timeout: 10000 }).should('be.visible')
      cy.get('li.p-dropdown-item:visible').first().should('be.visible').click()
    })

    // Enviar formulario
    cy.get('.button-container .link-button').should('be.visible').click()
    
    // Verificar éxito
    cy.get('.p-inline-message-success', { timeout: 15000 })
      .should('be.visible')
      .and('contain', 'Incidente actualizado correctamente')
  })

  it('debería mostrar error cuando falta el campo prioridad', () => {
    // Solo gravedad
    selectFromDropdown('div[id="gravedad"]', 'Alta')

    // Asignar técnicos
    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).should('be.visible').click()
      cy.get('div.p-dropdown-panel', { timeout: 10000 }).should('be.visible')
      cy.get('li.p-dropdown-item:visible').first().should('be.visible').click()
    })

    // Enviar formulario
    cy.get('.button-container .link-button').should('be.visible').click()
    
    // Verificar error
    cy.get('.p-inline-message-error', { timeout: 15000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando falta el campo gravedad', () => {
    // Solo prioridad
    cy.get('span[id="prioridad"]').should('be.visible').clear().type('1', { delay: 100 })

    // Asignar técnicos
    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).should('be.visible').click()
      cy.get('div.p-dropdown-panel', { timeout: 10000 }).should('be.visible')
      cy.get('li.p-dropdown-item:visible').first().should('be.visible').click()
    })

    // Enviar formulario
    cy.get('.button-container .link-button').should('be.visible').click()
    
    // Verificar error
    cy.get('.p-inline-message-error', { timeout: 15000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando faltan técnicos asignados', () => {
    // Prioridad y gravedad
    cy.get('span[id="prioridad"]').should('be.visible').clear().type('1', { delay: 100 })
    selectFromDropdown('div[id="gravedad"]', 'Alta')

    // No asignar técnicos
    
    // Enviar formulario
    cy.get('.button-container .link-button').should('be.visible').click()
    
    // Verificar error
    cy.get('.p-inline-message-error', { timeout: 15000 })
      .should('be.visible')
      .and('contain', 'Todos los robots deben tener un técnico asignado')
  })
})