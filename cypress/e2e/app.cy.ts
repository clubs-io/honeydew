describe('Landing Page Init', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit('/');
    // Find an h1 containing "Financial solutions for your"
    cy.get('h1').contains('Financial solutions for your');
  });
});





