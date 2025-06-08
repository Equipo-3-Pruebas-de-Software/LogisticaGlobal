describe('Clasificar Incidente', () => {
  const userInfo = {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
  }

  const seleccionarGravedad = (valor = 'Alta') => {
    cy.get('div[id="gravedad"]').click()
    cy.get('li.p-dropdown-item:visible', { timeout: 8000 })
      .contains(valor)
      .click({ force: true })
  }

  const asignarTecnicos = () => {
    cy.get('.robot-container').each(($robotContainer) => {
      cy.wrap($robotContainer).click()
      cy.get('li.p-dropdown-item:visible', { timeout: 8000 })
        .first()
        .click({ force: true })
    })
  }

  const enviarFormulario = () => {
    cy.get('.button-container .link-button').click()
  }

  const abrirIncidenteCreado = () => {
    cy.get('tbody.content-table tr').then(($rows) => {
      const creado = Array.from($rows).find(row =>
        Cypress.$(row).find('td').eq(3).text().trim().toLowerCase() === 'creado'
      )

      if (creado) {
        cy.wrap(creado).find('button#detalles').click({ force: true })
      } else {
        cy.log('No hay incidentes con estado "Creado", creando uno...')
        cy.exec('npm run create-test-incident').then(() => {
          cy.reload()
          cy.get('tbody.content-table tr', { timeout: 10000 })
            .first()
            .find('button#detalles')
            .click({ force: true })
        })
      }
    })
  }

  before(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('hideOverlaysOnDocumentScrolling')) return false
      return true
    })
  })

  beforeEach(() => {
    cy.visit('http://192.168.56.1:5173/')
    cy.get('input#rut', { timeout: 10000 }).should('be.visible').type(userInfo.rut)
    cy.get('input#password').type(userInfo.clave)
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 10000 }).should('include', '/supervisor')
    cy.contains(userInfo.nombre, { timeout: 10000 }).should('be.visible')

    cy.contains('a', 'Incidentes', { timeout: 10000 }).click()
    cy.get('tbody.content-table', { timeout: 15000 }).should('exist')
    cy.get('tbody.content-table tr', { timeout: 15000 }).should('have.length.gt', 0)
    abrirIncidenteCreado()
  })

  it('debería clasificar el incidente correctamente', () => {
    cy.get('span#prioridad').clear().type('1', { delay: 100 })
    seleccionarGravedad('Alta')
    asignarTecnicos()
    enviarFormulario()

    cy.get('.p-inline-message-success', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Incidente actualizado correctamente')
  })

  it('debería mostrar error cuando falta el campo prioridad', () => {
    seleccionarGravedad()
    asignarTecnicos()
    enviarFormulario()

    cy.get('.p-inline-message-error', { timeout: 8000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando falta el campo gravedad', () => {
    cy.get('span#prioridad').clear().type('1', { delay: 100 })
    asignarTecnicos()
    enviarFormulario()

    cy.get('.p-inline-message-error', { timeout: 8000 })
      .should('be.visible')
      .and('contain', 'Faltan campos obligatorios')
  })

  it('debería mostrar error cuando faltan técnicos asignados', () => {
    cy.get('span#prioridad').clear().type('1', { delay: 100 })
    seleccionarGravedad()
    enviarFormulario()

    cy.get('.p-inline-message-error', { timeout: 8000 })
      .should('be.visible')
      .and('contain', 'Todos los robots deben tener un técnico asignado')
  })
})
