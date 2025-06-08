describe('Clasificar Incidente', () => {
  const userInfo = {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
  }

  before(() => {
    // Configuración para ignorar errores específicos de la aplicación
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('hideOverlaysOnDocumentScrolling')) {
        return false
      }
      return true
    })
  })

  beforeEach(() => {
    cy.visit('http://frontend:5173/')
    
    // Login con verificación robusta
    cy.get('input[id="rut"]', { timeout: 10000 }).should('be.visible').type(userInfo.rut)
    cy.get('input[id="password"]').type(userInfo.clave)
    cy.get('button[type="submit"]').click()
    
    // Verificar login exitoso
    cy.url({ timeout: 10000 }).should('include', '/supervisor')
    cy.contains(userInfo.nombre, { timeout: 10000 }).should('be.visible')

    // Navegar a Incidentes
    cy.contains('a', 'Incidentes', { timeout: 10000 }).click()
    
    // Esperar a que la tabla cargue completamente
    cy.get('tbody.content-table', { timeout: 15000 }).should('exist')
    cy.get('tbody.content-table tr', { timeout: 15000 }).should('have.length.gt', 0)

    // Encontrar y hacer clic en un incidente con estado "Creado"
    cy.get('tbody.content-table tr').then(($rows) => {
      const row = Array.from($rows).find(row => {
        const estado = Cypress.$(row).find('td').eq(3).text().trim().toLowerCase()
        return estado === 'creado'
      })

      if (row) {
        cy.wrap(row).find('button#detalles').click({ force: true })
      } else {
        // Si no hay incidentes en estado "Creado", crear uno para pruebas
        cy.log('No hay incidentes en estado "Creado", creando uno...')
        cy.exec('npm run create-test-incident').then(() => {
          cy.reload()
          cy.get('tbody.content-table tr').first().find('button#detalles').click({ force: true })
        })
      }
    })
  })

  it('debería clasificar el incidente correctamente', () => {
    // Seleccionar prioridad
    cy.get('span[id="prioridad"]').clear().type('1', { delay: 100 })
    
    // Seleccionar gravedad
    cy.get('div[id="gravedad"]').click()
    cy.get('li.p-dropdown-item:visible', { timeout: 8000 })
      .contains('Alta')
      .click({ force: true })

    // Asignar técnicos a robots
    cy.get('.robot-container').each(($robotContainer, index) => {
      cy.wrap($robotContainer).click()
      cy.get('li.p-dropdown-item:visible', { timeout: 8000 })
        .first()
        .click({ force: true })
    })

    // Enviar formulario
    cy.get('.button-container .link-button').click()
    
    // Verificar mensaje de éxito
    cy.get('.p-inline-message-success', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Incidente actualizado correctamente')
  })

  it('debería mostrar error cuando falta el campo prioridad', () => {
    // Seleccionar solo gravedad
    cy.get('div[id="gravedad"]').click()
    cy.get('li.p-dropdown-item:visible')
      .contains('Alta')
      .click({ force: true })

    // Asignar técnicos
    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).click()
      cy.get('li.p-dropdown-item:visible')
        .first()
        .click({ force: true })
    })

    // Enviar formulario
    cy.get('.button-container .link-button').click()
    
    // Verificar mensaje de error
    cy.get('.p-inline-message-error', { timeout: 8000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando falta el campo gravedad', () => {
    // Solo prioridad
    cy.get('span[id="prioridad"]').clear().type('1', { delay: 100 })

    // Asignar técnicos
    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).click()
      cy.get('li.p-dropdown-item:visible')
        .first()
        .click({ force: true })
    })

    // Enviar formulario
    cy.get('.button-container .link-button').click()
    
    // Verificar mensaje de error
    cy.get('.p-inline-message-error', { timeout: 8000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando faltan técnicos asignados', () => {
    // Prioridad y gravedad
    cy.get('span[id="prioridad"]').clear().type('1', { delay: 100 })
    cy.get('div[id="gravedad"]').click()
    cy.get('li.p-dropdown-item:visible')
      .contains('Alta')
      .click({ force: true })

    // No asignar técnicos
    
    // Enviar formulario
    cy.get('.button-container .link-button').click()
    
    // Verificar mensaje de error
    cy.get('.p-inline-message-error', { timeout: 8000 })
      .should('be.visible')
      .and('contain', 'Todos los robots deben tener un técnico asignado')
  })
})