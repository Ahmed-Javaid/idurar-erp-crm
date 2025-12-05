describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login page correctly', () => {
    cy.get('h1').should('contain', 'Login');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="email"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Wait for redirect and check URL
    cy.url().should('include', '/dashboard');
    
    // Verify user is logged in
    cy.get('[data-cy="user-menu"]').should('be.visible');
  });

  it('should show error message with invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@email.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Check for error message
    cy.get('.ant-message-error').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click();
    
    // Check for validation errors
    cy.get('.ant-form-item-explain-error').should('have.length.at.least', 1);
  });

  it('should logout successfully', () => {
    // Login first
    cy.login('admin@admin.com', 'admin123');
    
    // Navigate to dashboard
    cy.visit('/dashboard');
    
    // Click logout
    cy.get('[data-cy="user-menu"]').click();
    cy.get('[data-cy="logout-button"]').click();
    
    // Verify redirect to login
    cy.url().should('include', '/login');
  });
});

describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.login('admin@admin.com', 'admin123');
    cy.visit('/dashboard');
  });

  it('should display dashboard correctly', () => {
    cy.get('h1').should('contain', 'Dashboard');
    cy.get('[data-cy="stats-card"]').should('have.length.at.least', 3);
  });

  it('should display statistics cards', () => {
    cy.get('[data-cy="total-customers"]').should('be.visible');
    cy.get('[data-cy="total-invoices"]').should('be.visible');
    cy.get('[data-cy="total-revenue"]').should('be.visible');
  });

  it('should navigate to customers page', () => {
    cy.get('[data-cy="nav-customers"]').click();
    cy.url().should('include', '/customer');
  });
});

describe('Customer Management Tests', () => {
  beforeEach(() => {
    cy.login('admin@admin.com', 'admin123');
    cy.visit('/customer');
  });

  it('should display customer list', () => {
    cy.get('h1').should('contain', 'Customer');
    cy.get('.ant-table').should('be.visible');
  });

  it('should create a new customer', () => {
    cy.get('[data-cy="add-customer-button"]').click();
    
    // Fill in customer form
    cy.get('input[name="company"]').type('Test Company Ltd');
    cy.get('input[name="name"]').type('John');
    cy.get('input[name="surname"]').type('Doe');
    cy.get('input[name="email"]').type(`test${Date.now()}@example.com`);
    cy.get('input[name="phone"]').type('+1234567890');
    cy.get('input[name="address"]').type('123 Test Street');
    cy.get('input[name="country"]').type('USA');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.ant-message-success').should('be.visible');
    
    // Verify customer appears in list
    cy.get('.ant-table').should('contain', 'Test Company Ltd');
  });

  it('should search for customers', () => {
    cy.get('[data-cy="search-input"]').type('Test Company');
    cy.get('.ant-table-tbody tr').should('have.length.at.least', 1);
  });

  it('should edit a customer', () => {
    // Click edit on first customer
    cy.get('[data-cy="edit-button"]').first().click();
    
    // Update customer info
    cy.get('input[name="phone"]').clear().type('+0987654321');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.ant-message-success').should('be.visible');
  });

  it('should delete a customer', () => {
    // Click delete on last customer
    cy.get('[data-cy="delete-button"]').last().click();
    
    // Confirm deletion
    cy.get('.ant-modal-confirm-btns .ant-btn-primary').click();
    
    // Verify success message
    cy.get('.ant-message-success').should('be.visible');
  });
});

describe('Invoice Management Tests', () => {
  beforeEach(() => {
    cy.login('admin@admin.com', 'admin123');
    cy.visit('/invoice');
  });

  it('should display invoice list', () => {
    cy.get('h1').should('contain', 'Invoice');
    cy.get('.ant-table').should('be.visible');
  });

  it('should create a new invoice', () => {
    cy.get('[data-cy="add-invoice-button"]').click();
    
    // Select customer
    cy.get('[data-cy="customer-select"]').click();
    cy.get('.ant-select-dropdown .ant-select-item').first().click();
    
    // Fill invoice details
    cy.get('input[name="number"]').type(`INV-${Date.now()}`);
    cy.get('[data-cy="date-picker"]').click();
    cy.get('.ant-picker-today-btn').click();
    
    // Add invoice item
    cy.get('[data-cy="add-item-button"]').click();
    cy.get('input[name="items[0].itemName"]').type('Service Item');
    cy.get('input[name="items[0].quantity"]').clear().type('2');
    cy.get('input[name="items[0].price"]').clear().type('100');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.ant-message-success').should('be.visible');
  });

  it('should filter invoices by status', () => {
    cy.get('[data-cy="status-filter"]').click();
    cy.get('.ant-select-dropdown').contains('Paid').click();
    
    // Verify filtered results
    cy.get('.ant-table-tbody tr').each(($row) => {
      cy.wrap($row).should('contain', 'Paid');
    });
  });

  it('should generate invoice PDF', () => {
    cy.get('[data-cy="view-button"]').first().click();
    cy.get('[data-cy="download-pdf-button"]').should('be.visible').click();
    
    // Verify PDF download initiated (file download can't be easily tested in Cypress)
    cy.get('.ant-message-success').should('be.visible');
  });
});

describe('Quote Management Tests', () => {
  beforeEach(() => {
    cy.login('admin@admin.com', 'admin123');
    cy.visit('/quote');
  });

  it('should display quote list', () => {
    cy.get('h1').should('contain', 'Quote');
    cy.get('.ant-table').should('be.visible');
  });

  it('should create a new quote', () => {
    cy.get('[data-cy="add-quote-button"]').click();
    
    // Select customer
    cy.get('[data-cy="customer-select"]').click();
    cy.get('.ant-select-dropdown .ant-select-item').first().click();
    
    // Fill quote details
    cy.get('input[name="number"]').type(`QUO-${Date.now()}`);
    
    // Add quote item
    cy.get('[data-cy="add-item-button"]').click();
    cy.get('input[name="items[0].itemName"]').type('Consultation Service');
    cy.get('input[name="items[0].quantity"]').clear().type('1');
    cy.get('input[name="items[0].price"]').clear().type('500');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.ant-message-success').should('be.visible');
  });

  it('should convert quote to invoice', () => {
    cy.get('[data-cy="convert-button"]').first().click();
    
    // Confirm conversion
    cy.get('.ant-modal-confirm-btns .ant-btn-primary').click();
    
    // Verify success and redirect to invoice
    cy.url().should('include', '/invoice');
    cy.get('.ant-message-success').should('be.visible');
  });
});

describe('Payment Management Tests', () => {
  beforeEach(() => {
    cy.login('admin@admin.com', 'admin123');
    cy.visit('/payment');
  });

  it('should display payment list', () => {
    cy.get('h1').should('contain', 'Payment');
    cy.get('.ant-table').should('be.visible');
  });

  it('should record a new payment', () => {
    cy.get('[data-cy="add-payment-button"]').click();
    
    // Select invoice
    cy.get('[data-cy="invoice-select"]').click();
    cy.get('.ant-select-dropdown .ant-select-item').first().click();
    
    // Fill payment details
    cy.get('input[name="amount"]').type('100');
    cy.get('[data-cy="payment-mode-select"]').click();
    cy.get('.ant-select-dropdown').contains('Cash').click();
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.ant-message-success').should('be.visible');
  });
});

describe('Settings Tests', () => {
  beforeEach(() => {
    cy.login('admin@admin.com', 'admin123');
    cy.visit('/settings');
  });

  it('should display settings page', () => {
    cy.get('h1').should('contain', 'Settings');
  });

  it('should update company settings', () => {
    cy.get('input[name="company_name"]').clear().type('Updated Company Name');
    cy.get('input[name="company_email"]').clear().type('updated@company.com');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('.ant-message-success').should('be.visible');
  });
});

describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach((viewport) => {
    it(`should display correctly on ${viewport.name}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.login('admin@admin.com', 'admin123');
      cy.visit('/dashboard');
      
      cy.get('h1').should('be.visible');
      cy.get('[data-cy="nav-menu"]').should('be.visible');
    });
  });
});

describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.login('admin@admin.com', 'admin123');
  });

  it('should have proper ARIA labels', () => {
    cy.visit('/dashboard');
    cy.get('[role="navigation"]').should('exist');
    cy.get('[role="main"]').should('exist');
  });

  it('should support keyboard navigation', () => {
    cy.visit('/customer');
    cy.get('[data-cy="add-customer-button"]').focus();
    cy.focused().should('have.attr', 'data-cy', 'add-customer-button');
    cy.focused().type('{enter}');
  });
});
