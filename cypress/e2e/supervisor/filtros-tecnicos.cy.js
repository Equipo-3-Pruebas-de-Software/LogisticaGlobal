describe('Filtrar Técnicos', () => {
  const userCredentials = {
    rut: '12345677-9',
    password: 'clave123'
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
    cy.visit('http://host.docker.internal:5173/')
    cy.get('input[id="rut"]', { timeout: 10000 }).should('be.visible').type(userCredentials.rut)
    cy.get('input[id="password"]').type(userCredentials.password)
    cy.get('button[type="submit"]').click()

    cy.url({ timeout: 10000 }).should('include', '/supervisor')
    cy.contains('a', 'Técnicos', { timeout: 8000 }).click()

    // Esperar a que cargue la tabla de técnicos
    cy.get('tbody.content-table', { timeout: 15000 }).should('exist')
    cy.get('tbody.content-table tr', { timeout: 15000 }).should('have.length.gt', 0)
  })

  it('debería filtrar por disponibilidad', () => {
    const filterColumnIndex = 3 // Suponiendo que es la 3era columna (índice 2 + 1)

    cy.contains('span', 'Disponibilidad').click()
    cy.get('li.p-dropdown-item:visible', { timeout: 8000 }).first().as('firstFilterOption')

    cy.get('@firstFilterOption').then(($option) => {
      const filterValue = $option.text().trim().toLowerCase()
      cy.get('@firstFilterOption').click()

      cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist')

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

  it('debería filtrar por búsqueda en cualquier columna', () => {
    const searchText = "Gonzalez"

    cy.get('input[id="busqueda"]', { timeout: 8000 }).should('be.visible').type(searchText)
    cy.get('.p-progressbar', { timeout: 10000 }).should('not.exist')

    cy.get('tbody.content-table tr', { timeout: 8000 }).should('have.length.gt', 0)

    cy.get('tbody.content-table tr').each(($row) => {
      cy.wrap($row).find('td').then(($cells) => {
        const found = [...$cells].some(cell =>
          cell.innerText.trim().toLowerCase().includes(searchText.toLowerCase())
        )
        expect(found, `Texto "${searchText}" no encontrado en la fila`).to.be.true
      })
    })
  })
})
