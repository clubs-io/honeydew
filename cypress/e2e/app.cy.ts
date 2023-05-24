describe('Landing Page Init', () => {
  it('should load landing page', () => {
    // Start from the index page
    cy.visit('/');
    // Find an h1 containing "Financial solutions for your"
    cy.get('h1').contains('Financial solutions for your');
  });
});


describe('Landing Page Features', () => {
  it('should navigate to the features page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="features"]').click();

    // The new url should include "/features"
    cy.url().should('include', '/features');

    // Find an h1 containing "Features"
    cy.get('h1').contains('Features');
  });
});

describe('Landing Page Team', () => {
  it('should navigate to the team page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a link with an href attribute containing "team" and click it
    cy.get('a[href*="team"]').click();

    // The new url should include "/about"
    cy.url().should('include', '/team');

    // Find an h1 containing "Team"
    cy.get('h1').contains('Team');
  });
});

describe('Landing Page Contact', () => {
  it('should navigate to the contact page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a link with an href attribute containing "contact" and click it
    cy.get('a[href*="contact"]').click();

    // The new url should include "/about"
    cy.url().should('include', '/contact');

    // Find an h1 containing "Contact"
    cy.get('h1').contains('Contact');
  });
});

describe('Landing Page GitHub Link', () => {
  it('should navigate to the github page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a link with an href attribute containing github link
    cy.get('a[href*="https://github.com/clubs-io/honeydew"]').click();
  });
});

describe('Landing Page Getting Started', () => {
  it('should navigate to the getting started page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a link with an href attribute containing "getstarted" and click it
    cy.get('a[href*="/getstarted"]').click();

    // The new url should include "/about"
    cy.url().should('include', '/getstarted');
    
    // Find an h1 containing "get Started"
    cy.get('h1').contains('Get Started');
  });
});

describe('Landing Page Sign In', () => {
  it('should navigate to the sign in page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a link with an href attribute containing "signin" and click it
    cy.get('button').contains('Sign in').click();

    // The new url should include "/auth/signin"
    cy.url().should('include', '/auth/signin');
    
    // Find an h2 containing "Log in"
    cy.get('h2').contains('Log in');
  });
});