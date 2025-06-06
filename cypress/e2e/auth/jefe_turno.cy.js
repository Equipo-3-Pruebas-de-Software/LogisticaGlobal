describe('auth jefe_turno', () => {

  const userInfo = {
    nombre: "Lucas Castro",
    rut: "11111111-1",
    clave: "clave123",
  }

  let loggedIn = false;

  it ("Debería darle credenciales incorrectas", () => {
    cy.visit('http://3.139.240.205:5173/');
    cy.get('input[id="rut"]').type('11111112-1');
    cy.get('input[id="password"]').type('clave123');
    cy.get('button[type="submit"]').click();
    cy.contains("Credenciales inválidas")
  })

  it ("Debería poder entrar a la Home y luego cerrar sesión", () => {
    cy.visit('http://3.139.240.205:5173/');
    cy.get('input[id="rut"]').type(userInfo.rut);
    cy.get('input[id="password"]').type(userInfo.clave);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/jefe_turno');
    cy.contains("Crear Incidente")
    
    cy.get('a').contains('Cerrar sesión').click();
    cy.url().should('include', '/');
    cy.contains("Iniciar Sesión");
  })
})
