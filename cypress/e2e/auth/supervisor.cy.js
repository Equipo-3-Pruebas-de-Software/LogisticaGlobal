describe('template spec', () => {

  const userInfo = {
    nombre: "Margarita Rodriguez",
    rut: "12345677-9",
    clave: "clave123",
  }

  it ("Debería darle credenciales incorrectas", () => {
    cy.visit('http://localhost:5173/');
    cy.get('input[id="rut"]').type('11111112-1');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.contains("Credenciales inválidas")
  })

  it ("Debería poder entrar a la Home y luego cerrar sesión", () => {
    cy.visit('http://localhost:5173/');
    cy.get('input[id="rut"]').type(userInfo.rut);
    cy.get('input[id="password"]').type(userInfo.clave);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor');
    cy.contains(userInfo.nombre)

    cy.get('a').contains('Cerrar sesión').click();
    cy.url().should('include', '/');
    cy.contains("Iniciar Sesión");
  })
  
})