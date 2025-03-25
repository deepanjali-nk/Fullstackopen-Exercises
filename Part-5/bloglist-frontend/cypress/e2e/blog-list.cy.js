describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST','http://localhost:3001/api/testing/reset')
    const user={
      name: 'Don',
      username: 'deepanjali',
      password: 'okay'
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    cy.visit('http://localhost:5175') 
  })

  it('Login form is shown', function() {
    cy.contains('login').click()
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
    cy.contains('cancel')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('deepanjali')
      cy.get('#password').type('okay')
      cy.get('#login').click()
      cy.contains('Don logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('#username').type('deepa')
      cy.get('#password').type('wrong')
      cy.get('#login').click()

      cy.contains('Wrong username or password')
    })

    describe('When Logged in', function() {
      beforeEach(function() {
        cy.contains('login').click()
        cy.get('#username').type('deepanjali')
        cy.get('#password').type('okay')
        cy.get('#login').click()
      })

      it('a new blog can be created',function(){
        cy.contains('create new blog').click()
        cy.get('#title').type('Blog created by cypress')
        cy.get('#author').type('Cypress')
        cy.get('#url').type('www.cypress.com')
        cy.get('#create').click()
        cy.contains('Blog created by cypress')
        cy.contains('Cypress')
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })
      
      
    })
  })


})