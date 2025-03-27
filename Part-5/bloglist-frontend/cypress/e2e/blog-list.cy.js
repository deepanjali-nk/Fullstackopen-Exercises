describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3002/api/testing/reset");
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3002/api/users/", user);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("login").click();
    cy.contains("Login");
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
    cy.contains("cancel");
  });

  describe("Login", function () {
    it("it succeeds with correct credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("salainen");
      cy.get("#login").click();
      cy.contains("Matti Luukkainen logged-in");
    });

    it("it fails with wrong credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("wrong");
      cy.get("#login").click();
      cy.get(".error").contains("Wrong username or password");
    });

    describe("When logged in", function () {
      beforeEach(function () {
        cy.contains("login").click();
        cy.get("#username").type("mluukkai");
        cy.get("#password").type("salainen");
        cy.get("#login").click();
      });

      it("A blog can be created", function () {
        cy.contains("create new blog").click();
        cy.get("#title").type("a blog created by cypress");
        cy.get("#author").type("cypress");
        cy.get("#url").type("https://docs.cypress.io/");
        cy.get("#create").click();
        cy.contains("a blog created by cypress");
        cy.contains("cypress");
      });

      it("A blog can be liked", function () {
        cy.contains("create new blog").click();
        cy.get("#title").type("New Blog");
        cy.get("#author").type("Cypress tester");
        cy.get("#url").type("www.example.com");
        cy.get("#create").click();
        cy.contains("New Blog");
        cy.contains("Cypress tester");
        cy.contains("View").click();
        cy.contains("Likes: 0").should("exist");
        cy.get("#like").click();
        cy.contains("Likes: 1").should("exist");
      });

      it("Only the creator can see the delete button", function () {
        // Create a blog as the first user (creator)
        cy.contains("create new blog").click();
        cy.get("#title").type("Blog Created by mluukkai");
        cy.get("#author").type("Matti Luukkainen");
        cy.get("#url").type("https://example.com");
        cy.get("#create").click();
        
        // Ensure the blog was created successfully
        cy.contains("Blog Created by mluukkai");
        
        // Log out the first user
        cy.contains("logout").click();
        
        // Create a second user
        const user2 = {
          name: "Another User",
          username: "anotheruser",
          password: "123456",
        };
        cy.request("POST", "http://localhost:3002/api/users/", user2);
  
        // Log in as the second user
        cy.contains("login").click();
        cy.get("#username").type("anotheruser");
        cy.get("#password").type("123456");
        cy.get("#login").click();

        // cy.contains("Blog Created by mluukkai");
        cy.contains("View").click();
        cy.get("#delete").should("not.exist");
  
        // Log out the second user
        cy.contains("logout").click();
  
        // Log in again as the first user (creator)
        cy.contains("show login").click();
        cy.get("#username").type("mluukkai");
        cy.get("#password").type("salainen");
        cy.get("#login").click();
  
        // Check that the creator (first user) can see the delete button
        cy.contains("Blog Created by mluukkai");
        cy.contains("View").click();
        cy.get("#delete").should("exist");
      });
    });
  });
});
