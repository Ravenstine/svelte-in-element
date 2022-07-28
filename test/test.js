describe('in-element component', () => {
  it('renders block in arbitrary element', () => {
    cy.visit('/');

    cy.get('#target-a h2')
      .should((h2) => {
        expect(h2).to.have.text('Hello World');
      });
  });

  it('reflects data changes', () => {
    cy.visit('/');

    cy.get('input')
      .type('!')
      .then(() => {
        cy.get('#target-a h2')
        .should((h2) => {
          expect(h2).to.have.text('Hello World!');
        });
      });
  });

  it('handles child removal', () => {
    cy.visit('/');

    cy.get('button#show-hide')
      .click()
      .then(() => {
        return cy.get('#target-a h2').should('not.exist');
      })
      .then(() => {
        return cy.get('button#show-hide').click();
      })
      .then(() => {
        return cy.get('#target-a h2').should('exist');
      });
  });

  it('dynamically switches targets', () => {
    cy.visit('/');

    cy.get('#target-a h2').should('exist');
    cy.get('#target-b h2').should('not.exist');

    cy.get('button#switch-target')
      .click()
      .then(() => {
        cy.get('#target-a h2').should('not.exist');
        cy.get('#target-b h2').should('exist');
      })
      .then(() => {
        return cy.get('button#switch-target').click();
      })
      .then(() => {
        cy.get('#target-a h2').should('exist');
        cy.get('#target-b h2').should('not.exist');
      });
  });
});
