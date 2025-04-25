describe('App', () => {
  it('should load the homepage and contain a specific text', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Vite + React');
  });
});
