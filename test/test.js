describe('in-element component', () => {
  it('renders block in arbitrary element', () => {
    cy.visit('/');

    cy.get('#target h2')
      .should((h2) => {
        expect(h2).to.have.text('Hello World');
      });
  });

  it('reflects data changes', () => {
    cy.visit('/');

    cy.get('input')
      .type('!')
      .then(() => {
        cy.get('#target h2')
        .should((h2) => {
          expect(h2).to.have.text('Hello World!');
        });
      });
  });

  it('handles child removal', () => {
    cy.visit('/');

    cy.get('button')
      .click()
      .then(() => {
        return cy.get('#target h2').should('not.exist');
      })
      .then(() => {
        return cy.get('button').click();
      })
      .then(() => {
        return cy.get('#target h2').should('exist');
      });
  });
});
