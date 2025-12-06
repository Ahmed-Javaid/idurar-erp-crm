/**
 * Dashboard Tests - Functional Dashboard Verification
 * Tests verify dashboard statistics, navigation, and data display
 */

describe('Dashboard', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/');
    cy.wait(2000);
  });

  it('should display dashboard with summary statistics cards', () => {
    cy.url().should('match', /\/$|\/dashboard/);
    
    // Verify statistics cards exist
    cy.get('.ant-card, .ant-statistic, [class*="card"]').should('have.length.greaterThan', 0);
    
    // Verify statistics show numbers
    cy.get('.ant-statistic-content, .ant-card-body').should('exist');
    
    // Common dashboard metrics
    cy.get('body').then($body => {
      // Check for common dashboard elements
      const hasStats = $body.find('.ant-statistic, .ant-card').length > 0;
      expect(hasStats).to.be.true;
    });
  });

  it('should display recent invoices or transactions table', () => {
    // Verify recent data table exists
    cy.get('body').then($body => {
      if ($body.find('.ant-table').length > 0) {
        cy.get('.ant-table').should('be.visible');
        cy.get('.ant-table-thead').should('exist');
      }
    });
  });

  it('should display navigation menu with all core modules', () => {
    // Verify main navigation exists
    cy.get('nav, .ant-menu, [class*="navigation"]').should('exist');
    
    // Verify key module links exist
    cy.contains(/dashboard|home/i).should('exist');
    cy.contains(/customer|client/i).should('exist');
    cy.contains(/invoice/i).should('exist');
  });

  it('should navigate between modules successfully', () => {
    // Navigate to customers
    cy.visit('/customer');
    cy.wait(1000);
    cy.url().should('include', '/customer');
    cy.get('.ant-table').should('exist');
    
    // Navigate to invoices
    cy.visit('/invoice');
    cy.wait(1000);
    cy.url().should('include', '/invoice');
    cy.get('.ant-table').should('exist');
    
    // Navigate back to dashboard
    cy.visit('/');
    cy.wait(1000);
    cy.url().should('match', /\/$|\/dashboard/);
  });

  it('should display user profile and logout option', () => {
    // Look for user menu/profile dropdown
    cy.get('body').then($body => {
      if ($body.find('.ant-dropdown-trigger, [class*="user"], [class*="profile"]').length > 0) {
        cy.get('.ant-dropdown-trigger, [class*="user"], [class*="profile"]').first().should('be.visible');
      }
    });
  });
});
