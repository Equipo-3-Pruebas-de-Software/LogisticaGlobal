describe('Filtrar Incidentes', () => {
  const userCredentials = {
    rut: '12345677-9',
    password: 'clave123'
  }

  before(() => {
    // Configurar manejo de excepciones no controladas
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('hideOverlaysOnDocumentScrolling')) {
        return false
      }
      return true
    })
  })

  beforeEach(() => {
    // Visitar la página y hacer login
    cy.visit('http://host.docker.internal:5173/')
    cy.get('input[id="rut"]', { timeout: 10000 }).should('be.visible').type(userCredentials.rut)
    cy.get('input[id="password"]').type(userCredentials.password)
    cy.get('button[type="submit"]').click()
    
    // Verificar login exitoso
    cy.url({ timeout: 10000 }).should('include', '/supervisor')
    
    // Navegar a la sección de Incidentes
    cy.contains('a', 'Incidentes', { timeout: 8000 }).click()
    
    // Esperar a que la tabla de incidentes cargue completamente
    cy.get('tbody.content-table', { timeout: 15000 }).should('exist')
    cy.get('tbody.content-table tr', { timeout: 15000 }).should('have.length.gt', 0)
  })

  it('debería solo ver mis incidentes y verificar botón firmar', () => {
    cy.contains("button", "Mis Incidentes").click()
    
    // Esperar a que se aplique el filtro
    cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist')
    
    // Verificar que todas las filas tienen botón de firmar
    cy.get('tbody.content-table tr').each(($row) => {
      cy.wrap($row)
        .find('td:nth-child(7) button#firmar')
        .should('exist')
        .and('be.visible')
    })
  })

  it('debería filtrar por gravedad', () => {
    const filterColumnIndex = 5 // Índice de la columna de gravedad
    
    // Abrir dropdown de filtro
    cy.contains('span', 'Gravedad').click()
    cy.get('li.p-dropdown-item:visible', { timeout: 8000 }).first().as('firstFilterOption')
    
    // Obtener texto del primer item y filtrar
    cy.get('@firstFilterOption').then(($option) => {
      const filterValue = $option.text().trim().toLowerCase()
      cy.get('@firstFilterOption').click()
      
      // Esperar a que se aplique el filtro
      cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist')
      
      // Verificar resultados
      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row)
          .find(`td:nth-child(${filterColumnIndex})`)
          .invoke('text')
          .then((text) => {
            expect(text.trim().toLowerCase()).to.equal(filterValue)
          })
      })
    })
  })

  it('debería filtrar por prioridad', () => {
    const filterColumnIndex = 4 // Índice de la columna de prioridad
    
    // Abrir dropdown de filtro
    cy.contains('span', 'Prioridad').click()
    cy.get('li.p-dropdown-item:visible', { timeout: 8000 }).first().as('firstFilterOption')
    
    // Obtener valor del primer item y filtrar
    cy.get('@firstFilterOption').then(($option) => {
      const filterValue = Number($option.text().trim())
      cy.get('@firstFilterOption').click()
      
      // Esperar a que se aplique el filtro
      cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist')
      
      // Verificar resultados
      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row)
          .find(`td:nth-child(${filterColumnIndex})`)
          .invoke('text')
          .then((text) => {
            expect(Number(text.trim())).to.equal(filterValue)
          })
      })
    })
  })

  it('debería filtrar por estado', () => {
    const filterColumnIndex = 3 // Índice de la columna de estado
    
    // Abrir dropdown de filtro
    cy.contains('span', 'Estado').click()
    cy.get('li.p-dropdown-item:visible', { timeout: 8000 }).first().as('firstFilterOption')
    
    // Obtener texto del primer item y filtrar
    cy.get('@firstFilterOption').then(($option) => {
      const filterValue = $option.text().trim().toLowerCase()
      cy.get('@firstFilterOption').click()
      
      // Esperar a que se aplique el filtro
      cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist')
      
      // Verificar resultados
      cy.get('tbody.content-table tr').each(($row) => {
        cy.wrap($row)
          .find(`td:nth-child(${filterColumnIndex})`)
          .invoke('text')
          .then((text) => {
            expect(text.trim().toLowerCase()).to.equal(filterValue)
          })
      })
    })
  })

  it('debería filtrar por búsqueda', () => {
    const searchText = "zona de"
    const searchColumnIndex = 1 // Índice de la columna a buscar
    
    // Realizar búsqueda
    cy.get('input[id="busqueda"]', { timeout: 8000 })
      .should('be.visible')
      .type(searchText)
    
    // Esperar a que se aplique el filtro
    cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist')
    
    // Verificar que al menos hay un resultado
    cy.get('tbody.content-table tr', { timeout: 8000 }).should('have.length.gt', 0)
    
    // Verificar resultados
    cy.get('tbody.content-table tr').each(($row) => {
      cy.wrap($row)
        .find(`td:nth-child(${searchColumnIndex})`)
        .invoke('text')
        .then((text) => {
          expect(text.trim().toLowerCase()).to.include(searchText)
        })
    })
  })
})