describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3002/api/testing/reset');
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    };
    cy.request('POST', 'http://localhost:3002/api/users/', user);
    cy.visit('http://localhost:5173');
  });

  it('Login form is shown', function() {
    cy.contains('login').click();
    cy.contains('Login');
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
    cy.contains('cancel');
  });

  describe('Login', function() {
    it('it succeeds with correct credentials', function() {
      cy.contains('login').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('salainen');
      cy.get('#login').click();
      cy.contains('Matti Luukkainen logged-in');
    });

    it('it fails with wrong credentials', function() {
      cy.contains('login').click();
      cy.get('#username').type('mluukkai');
      cy.get('#password').type('wrong');
      cy.get('#login').click();
      cy.get('.error').contains('Wrong username or password');
      // cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
    });

    describe('When logged in', function() {
      beforeEach(function() {
        cy.contains('login').click();
        cy.get('#username').type('mluukkai');
        cy.get('#password').type('salainen');
        cy.get('#login').click();
      });

      it('A blog can be created', function() {
        cy.contains('create new blog').click();
        cy.get('#title').type('a blog created by cypress');
        cy.get('#author').type('cypress');
        cy.get('#url').type('https://docs.cypress.io/');
        cy.get('#create').click();
        cy.contains('a blog created by cypress');
        cy.contains('cypress');
      });
    });
  });
});