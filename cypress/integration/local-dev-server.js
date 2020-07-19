// npm run dev


describe('My First Test', () => {
  it('Visits the localhost:9000', () => {
    cy.visit('http://localhost:9000')
    cy.contains('Source')
    cy.contains('Login')
  })
})
