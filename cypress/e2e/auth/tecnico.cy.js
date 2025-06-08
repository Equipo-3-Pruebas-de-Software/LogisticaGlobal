describe('template spec', () => {

  const userInfo = {
    nombre: "Juan Perez",
    rut: "14856536-8",
    clave: "clave123",
  }

  it ("Debería darle credenciales incorrectas", () => {
    cy.visit('http://192.168.56.1:5173/');
    cy.get('input[id="rut"]').type('11111112-1');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.contains("Credenciales inválidas")
  })

  it ("Debería poder entrar a la Home y cerrar sesión", () => {
    cy.visit('http://192.168.56.1:5173/');
    cy.get('input[id="rut"]').type(userInfo.rut);
    cy.get('input[id="password"]').type(userInfo.clave);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/tecnico');
    cy.contains("Robots Asignados")

    cy.get('a').contains('Cerrar sesión').click();
    cy.url().should('include', '/');
    cy.contains("Iniciar Sesión");
  })
  
})