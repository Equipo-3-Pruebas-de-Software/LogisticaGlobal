beforeEach(() => {
  // Verificar consola para errores
  Cypress.on('window:before:load', (win) => {
    cy.spy(win.console, 'error')
    cy.spy(win.console, 'warn')
  })

  cy.visit('http://192.168.56.1:5173/', {
    onBeforeLoad(win) {
      cy.stub(win.console, 'error').as('consoleError')
      cy.stub(win.console, 'warn').as('consoleWarn')
    }
  })
  
  // Login con verificaciones mejoradas
  cy.get('input[id="rut"]', { timeout: 30000 }).should('be.visible').type(userInfo.rut)
  cy.get('input[id="password"]').should('be.visible').type(userInfo.clave)
  cy.get('button[type="submit"]').should('be.visible').click()
  
  // Verificar login con más tolerancia
  cy.url({ timeout: 30000 }).should('include', '/supervisor')
  cy.contains(userInfo.nombre, { timeout: 30000 }).should('be.visible')

  // Navegar a Incidentes con esperas inteligentes
  cy.contains('a', 'Incidentes', { timeout: 30000 }).should('be.visible').click()
  
  // Esperar a la tabla con más condiciones
  cy.get('tbody.content-table', { timeout: 40000 }).should('exist')
  cy.get('tbody.content-table tr', { timeout: 40000 }).should('have.length.gt', 0)

  // Encontrar y manejar incidentes con estado "Creado"
  cy.get('tbody.content-table tr').then(($rows) => {
    const row = Array.from($rows).find(row => {
      const estado = Cypress.$(row).find('td').eq(3).text().trim().toLowerCase()
      return estado === 'creado'
    })

    if (row) {
      cy.screenshot('antes-de-detalles')
      cy.wrap(row).find('button#detalles').should('be.visible').click({ force: true })
      cy.screenshot('despues-de-detalles')
      
      // Esperar al modal con múltiples condiciones y mayor timeout
      cy.get('.p-dialog', { timeout: 60000 })
        .should('exist')
        .and('be.visible')
      cy.get('.p-dialog-content', { timeout: 30000 }).should('be.visible')
      cy.get('.p-dialog-title', { timeout: 30000 }).should('contain', 'Detalles del Incidente')
    } else {
      cy.log('No hay incidentes en estado "Creado", creando uno...')
      cy.exec('npm run create-test-incident').then(() => {
        cy.reload()
        cy.get('tbody.content-table tr', { timeout: 40000 }).should('have.length.gt', 0)
        cy.get('tbody.content-table tr').first().find('button#detalles').click({ force: true })
        
        // Esperar al modal después de crear incidente
        cy.get('.p-dialog', { timeout: 60000 })
          .should('exist')
          .and('be.visible')
        cy.get('.p-dialog-content', { timeout: 30000 }).should('be.visible')
      })
    }
  })

  // Verificar que no haya errores en consola
  cy.get('@consoleError').should('not.be.called')
  cy.get('@consoleWarn').should('not.be.called')
})