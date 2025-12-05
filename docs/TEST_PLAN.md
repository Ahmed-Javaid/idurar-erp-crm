# Test Plan for IDURAR ERP CRM Application
## IEEE 829 Standard Test Plan Document

**Project Name:** IDURAR ERP CRM - Comprehensive Quality Engineering Project

**Version:** 1.0

**Date:** December 5, 2025

**Prepared by:** SQE Team

---

## 1. Test Plan Identifier
**TP-IDURAR-001**

---

## 2. Introduction

### 2.1 Purpose
This document describes the comprehensive test plan for the IDURAR ERP CRM application, an open-source enterprise resource planning and customer relationship management system. The purpose is to ensure robust quality control through structured testing integrated into a CI/CD pipeline.

### 2.2 Scope
The test plan covers:
- Backend API testing (Node.js/Express)
- Frontend UI testing (React/Vite)
- Integration testing
- Performance testing
- Security testing
- Accessibility testing

### 2.3 Quality Objectives
- Achieve 80%+ code coverage for unit tests
- Zero critical bugs in production
- 95% of API responses under 500ms
- All user journeys tested via E2E tests
- Security vulnerabilities identified and addressed

---

## 3. Test Objective

The primary objectives of this testing effort are:

1. **Functional Correctness**: Ensure all features work as specified
2. **Performance**: Validate system performance under various load conditions
3. **Security**: Identify and mitigate security vulnerabilities
4. **Reliability**: Ensure system stability and availability
5. **Usability**: Verify user interface is intuitive and accessible
6. **Compatibility**: Test across different browsers and devices

---

## 4. Test Scope

### 4.1 Features to be Tested

#### 4.1.1 Authentication Module
- User login/logout
- Session management
- Token-based authentication
- Password reset functionality

#### 4.1.2 Customer Management
- Create new customers
- Read/view customer details
- Update customer information
- Delete customers
- Search and filter customers

#### 4.1.3 Invoice Management
- Create invoices
- Edit invoices
- View invoice details
- Generate invoice PDFs
- Send invoices via email
- Track invoice payments

#### 4.1.4 Quote Management
- Create quotes
- Convert quotes to invoices
- Edit and delete quotes
- Generate quote PDFs

#### 4.1.5 Payment Management
- Record payments
- Track payment history
- Payment reconciliation
- Multiple payment modes

#### 4.1.6 Reporting and Dashboard
- Dashboard statistics
- Sales reports
- Customer reports
- Payment reports

### 4.2 Features Not to be Tested
- Third-party integrations (tested by vendors)
- Database internals (MongoDB)
- External email service providers

---

## 5. Test Techniques

### 5.1 White-Box Testing (Structural Testing)
**Objective**: Test internal code structure, logic, and paths

**Techniques**:
- **Statement Coverage**: Ensure every line of code is executed
- **Branch Coverage**: Test all decision branches (if/else, switch)
- **Path Coverage**: Test all possible execution paths
- **Loop Testing**: Validate loop conditions and iterations

**Tools**: Jest, Istanbul for code coverage

**Test Areas**:
- Backend business logic
- Data validation functions
- Database query methods
- Authentication middleware
- Error handling mechanisms

### 5.2 Black-Box Testing (Functional Testing)
**Objective**: Test functionality without knowledge of internal code

**Techniques**:
- **Equivalence Partitioning**: Group inputs into valid/invalid classes
- **Boundary Value Analysis**: Test edge cases and limits
- **Decision Table Testing**: Test combinations of conditions
- **State Transition Testing**: Validate system state changes
- **Use Case Testing**: Test complete user workflows

**Tools**: Cypress, Postman

**Test Areas**:
- User login scenarios
- CRUD operations
- Form validations
- API endpoint responses
- User interface interactions

---

## 6. Test Tools and Frameworks

| Category | Tool | Purpose |
|----------|------|---------|
| **Backend Testing** | Jest | Unit and integration tests for Node.js |
| **API Testing** | Supertest | HTTP API endpoint testing |
| **UI Testing** | Cypress | End-to-end browser testing |
| **Performance** | k6 | Load and stress testing |
| **Security** | Trivy | Container vulnerability scanning |
| **Code Coverage** | Istanbul/NYC | Code coverage reporting |
| **CI/CD** | Jenkins, GitHub Actions | Automated pipeline execution |
| **Containerization** | Docker | Application packaging |
| **Monitoring** | New Relic, Sentry | Production monitoring |

---

## 7. Test Environment

### 7.1 Development Environment
- **OS**: Windows 11, Linux (Ubuntu 22.04)
- **Node.js**: v20.9.0
- **MongoDB**: v7.0 (Local or Atlas)
- **Browser**: Chrome, Firefox, Edge (latest versions)
- **IDE**: VS Code

### 7.2 Staging Environment
- **Platform**: AWS EC2 / Azure VM
- **OS**: Ubuntu Server 22.04
- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB Atlas (Staging Cluster)
- **URL**: http://staging.idurar.com

### 7.3 Production Environment
- **Platform**: AWS EC2 / Azure App Service
- **OS**: Ubuntu Server 22.04
- **Containerization**: Docker + Kubernetes
- **Database**: MongoDB Atlas (Production Cluster)
- **Load Balancer**: AWS ELB / Azure Load Balancer
- **CDN**: CloudFlare
- **URL**: https://app.idurar.com

---

## 8. Test Cases

### 8.1 Authentication Test Cases

#### TC-AUTH-001: Valid User Login (Black-Box)
**Objective**: Verify user can login with valid credentials

**Preconditions**: User account exists in database

**Test Steps**:
1. Navigate to login page (http://localhost:3000/login)
2. Enter valid email: `admin@admin.com`
3. Enter valid password: `admin123`
4. Click "Login" button

**Expected Result**: 
- User is redirected to dashboard
- Success message displayed
- User session token is stored
- User menu appears in header

**Test Data**:
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Priority**: High | **Type**: Functional | **Automation**: Yes

---

#### TC-AUTH-002: Invalid User Login (Black-Box)
**Objective**: Verify system rejects invalid credentials

**Test Steps**:
1. Navigate to login page
2. Enter email: `wrong@email.com`
3. Enter password: `wrongpassword`
4. Click "Login" button

**Expected Result**:
- Error message: "Invalid credentials"
- User remains on login page
- No session token created

**Priority**: High | **Type**: Negative Testing | **Automation**: Yes

---

#### TC-AUTH-003: Login with Empty Fields (Black-Box)
**Objective**: Verify form validation for required fields

**Test Steps**:
1. Navigate to login page
2. Leave email and password fields empty
3. Click "Login" button

**Expected Result**:
- Validation errors displayed under both fields
- Login button remains disabled or form doesn't submit

**Priority**: Medium | **Type**: Validation | **Automation**: Yes

---

#### TC-AUTH-004: Session Token Generation (White-Box)
**Objective**: Verify JWT token is correctly generated

**Test Steps**:
1. Call login API with valid credentials
2. Extract JWT token from response
3. Decode token payload
4. Verify token signature

**Expected Result**:
- Token contains user ID and role
- Token expiration is set correctly
- Token signature is valid

**Test Code**:
```javascript
const jwt = require('jsonwebtoken');
const token = response.body.result.token;
const decoded = jwt.verify(token, process.env.JWT_SECRET);
expect(decoded).toHaveProperty('userId');
expect(decoded).toHaveProperty('role');
```

**Priority**: High | **Type**: Security | **Automation**: Yes

---

### 8.2 Customer Management Test Cases

#### TC-CUST-001: Create New Customer (Black-Box)
**Objective**: Verify new customer can be created

**Preconditions**: User is authenticated

**Test Steps**:
1. Navigate to Customers page
2. Click "Add Customer" button
3. Fill in all required fields:
   - Company: "Test Company Ltd"
   - Name: "John"
   - Surname: "Doe"
   - Email: "john.doe@test.com"
   - Phone: "+1234567890"
4. Click "Submit" button

**Expected Result**:
- Success message displayed
- Customer appears in customer list
- Customer ID is generated
- All data is saved correctly

**Priority**: High | **Type**: Functional | **Automation**: Yes

---

#### TC-CUST-002: Update Customer Information (Black-Box)
**Objective**: Verify customer information can be updated

**Test Steps**:
1. Navigate to Customers page
2. Click "Edit" on existing customer
3. Update phone number to "+0987654321"
4. Click "Submit"

**Expected Result**:
- Success message displayed
- Updated information appears in customer list
- Database record is updated

**Priority**: High | **Type**: Functional | **Automation**: Yes

---

#### TC-CUST-003: Delete Customer (Black-Box)
**Objective**: Verify customer can be deleted

**Test Steps**:
1. Navigate to Customers page
2. Click "Delete" on a customer
3. Confirm deletion in modal dialog

**Expected Result**:
- Customer removed from list
- Database record is deleted
- Success confirmation displayed

**Priority**: High | **Type**: Functional | **Automation**: Yes

---

#### TC-CUST-004: Customer Data Validation (White-Box)
**Objective**: Test email validation logic

**Test Steps**:
1. Attempt to create customer with invalid email
2. Check validation function response

**Test Code**:
```javascript
const validateEmail = require('../utils/validation');
expect(validateEmail('invalid-email')).toBe(false);
expect(validateEmail('valid@email.com')).toBe(true);
```

**Expected Result**:
- Invalid emails are rejected
- Valid emails are accepted

**Priority**: Medium | **Type**: Validation | **Automation**: Yes

---

### 8.3 Invoice Management Test Cases

#### TC-INV-001: Create New Invoice (Black-Box)
**Objective**: Verify invoice creation workflow

**Test Steps**:
1. Navigate to Invoices page
2. Click "Create Invoice"
3. Select customer from dropdown
4. Enter invoice number: "INV-2025-001"
5. Add line item:
   - Item: "Consultation Service"
   - Quantity: 2
   - Price: 100
6. Verify calculated total: 200
7. Apply tax (10%): Total becomes 220
8. Click "Submit"

**Expected Result**:
- Invoice created successfully
- Invoice number is unique
- Calculations are correct
- Invoice status is "Pending"

**Priority**: High | **Type**: Functional | **Automation**: Yes

---

#### TC-INV-002: Invoice Calculation Logic (White-Box)
**Objective**: Test invoice total calculation function

**Test Code**:
```javascript
const calculateInvoiceTotal = require('../utils/invoice');

const invoice = {
  items: [
    { quantity: 2, price: 100 },
    { quantity: 1, price: 50 }
  ],
  taxRate: 10,
  discount: 20
};

const result = calculateInvoiceTotal(invoice);

expect(result.subTotal).toBe(250);
expect(result.discountAmount).toBe(20);
expect(result.taxableAmount).toBe(230);
expect(result.taxAmount).toBe(23);
expect(result.total).toBe(253);
```

**Priority**: High | **Type**: Logic | **Automation**: Yes

---

#### TC-INV-003: Generate Invoice PDF (Black-Box)
**Objective**: Verify PDF generation functionality

**Test Steps**:
1. Open an existing invoice
2. Click "Download PDF" button

**Expected Result**:
- PDF file is generated
- PDF contains all invoice details
- PDF is formatted correctly
- File downloads successfully

**Priority**: High | **Type**: Functional | **Automation**: Partial

---

### 8.4 Payment Management Test Cases

#### TC-PAY-001: Record Payment (Black-Box)
**Objective**: Verify payment can be recorded against invoice

**Test Steps**:
1. Navigate to Payments page
2. Click "Add Payment"
3. Select invoice from dropdown
4. Enter amount: 100
5. Select payment mode: "Cash"
6. Enter payment date
7. Click "Submit"

**Expected Result**:
- Payment recorded successfully
- Invoice status updated
- Payment appears in payment list

**Priority**: High | **Type**: Functional | **Automation**: Yes

---

### 8.5 API Endpoint Test Cases

#### TC-API-001: GET /api/customer/list
**Objective**: Test customer list endpoint

**Test Steps**:
1. Send GET request to `/api/customer/list`
2. Include valid authentication token

**Expected Result**:
- Status code: 200
- Response contains array of customers
- Response time < 500ms

**Test Code**:
```javascript
const response = await request(app)
  .get('/api/customer/list')
  .set('Authorization', `Bearer ${token}`)
  .expect(200);

expect(response.body.success).toBe(true);
expect(Array.isArray(response.body.result)).toBe(true);
```

**Priority**: High | **Type**: API | **Automation**: Yes

---

#### TC-API-002: POST /api/auth/login (Boundary Testing)
**Objective**: Test login endpoint with various inputs

**Test Cases**:
| Input | Expected Result |
|-------|----------------|
| Valid credentials | 200 OK, token returned |
| Invalid email format | 400 Bad Request |
| Empty password | 400 Bad Request |
| SQL injection attempt | 400 Bad Request, no DB error |
| XSS attempt | 400 Bad Request, sanitized |

**Priority**: High | **Type**: Security | **Automation**: Yes

---

### 8.6 Performance Test Cases

#### TC-PERF-001: Load Test - Normal Load
**Objective**: Test system under normal load conditions

**Configuration**:
- Virtual Users: 50
- Duration: 10 minutes
- Ramp-up: 2 minutes

**Success Criteria**:
- Average response time < 500ms
- 95th percentile < 1000ms
- Error rate < 1%
- CPU usage < 70%

**Priority**: High | **Type**: Performance | **Automation**: Yes

---

#### TC-PERF-002: Stress Test - Peak Load
**Objective**: Test system under stress conditions

**Configuration**:
- Virtual Users: 300
- Duration: 15 minutes
- Spike to 500 users

**Success Criteria**:
- System remains responsive
- No crashes or data corruption
- Graceful degradation
- Recovery after spike

**Priority**: High | **Type**: Performance | **Automation**: Yes

---

### 8.7 Security Test Cases

#### TC-SEC-001: SQL Injection Prevention
**Objective**: Verify protection against SQL injection

**Test Steps**:
1. Attempt login with SQL injection payload:
   ```
   email: "' OR '1'='1"
   password: "' OR '1'='1"
   ```

**Expected Result**:
- Request rejected
- No database error exposed
- Login fails safely

**Priority**: Critical | **Type**: Security | **Automation**: Yes

---

#### TC-SEC-002: XSS Prevention
**Objective**: Test cross-site scripting protection

**Test Steps**:
1. Create customer with XSS payload in name:
   ```html
   <script>alert('XSS')</script>
   ```

**Expected Result**:
- Input is sanitized
- Script doesn't execute
- Data stored safely

**Priority**: Critical | **Type**: Security | **Automation**: Yes

---

#### TC-SEC-003: CSRF Token Validation
**Objective**: Verify CSRF protection

**Test Steps**:
1. Attempt POST request without CSRF token
2. Attempt POST with invalid CSRF token

**Expected Result**:
- Requests are rejected
- 403 Forbidden response

**Priority**: High | **Type**: Security | **Automation**: Yes

---

### 8.8 Accessibility Test Cases

#### TC-ACC-001: Keyboard Navigation
**Objective**: Verify application is keyboard accessible

**Test Steps**:
1. Navigate through login form using Tab key
2. Submit form using Enter key
3. Navigate menu using arrow keys

**Expected Result**:
- All interactive elements are focusable
- Tab order is logical
- Keyboard shortcuts work

**Priority**: Medium | **Type**: Accessibility | **Automation**: Partial

---

#### TC-ACC-002: Screen Reader Compatibility
**Objective**: Test with screen reader (NVDA/JAWS)

**Test Steps**:
1. Enable screen reader
2. Navigate through main pages
3. Verify ARIA labels are read correctly

**Expected Result**:
- All content is accessible
- ARIA labels are descriptive
- Form errors are announced

**Priority**: Medium | **Type**: Accessibility | **Automation**: No

---

### 8.9 Responsive Design Test Cases

#### TC-RESP-001: Mobile View (375x667)
**Objective**: Test on mobile devices

**Test Steps**:
1. Set viewport to 375x667 (iPhone SE)
2. Test login flow
3. Navigate through dashboard
4. Create customer

**Expected Result**:
- Layout adapts correctly
- No horizontal scrolling
- Buttons are tappable
- Forms are usable

**Priority**: High | **Type**: UI | **Automation**: Yes

---

#### TC-RESP-002: Tablet View (768x1024)
**Objective**: Test on tablet devices

**Priority**: Medium | **Type**: UI | **Automation**: Yes

---

#### TC-RESP-003: Desktop View (1920x1080)
**Objective**: Test on desktop screens

**Priority**: High | **Type**: UI | **Automation**: Yes

---

## 9. Test Execution Schedule

| Phase | Duration | Activities | Responsible |
|-------|----------|------------|-------------|
| **Test Planning** | Week 1 | Test plan creation, tool setup | QA Lead |
| **Test Design** | Week 1-2 | Write test cases, create test data | QA Team |
| **Test Environment Setup** | Week 2 | Configure CI/CD, staging environment | DevOps |
| **Unit Testing** | Ongoing | Developer-written unit tests | Developers |
| **Integration Testing** | Week 3 | API and integration tests | QA Team |
| **System Testing** | Week 3-4 | E2E tests, UI tests | QA Team |
| **Performance Testing** | Week 4 | Load and stress tests | Performance Engineer |
| **Security Testing** | Week 4 | Vulnerability scanning | Security Team |
| **UAT** | Week 5 | User acceptance testing | Stakeholders |
| **Regression Testing** | Ongoing | Automated regression suite | CI/CD Pipeline |

---

## 10. Test Deliverables

### 10.1 Test Documentation
- ✅ Test Plan (this document)
- ✅ Test Cases Specification
- Test Data Sets
- Test Scripts (automated)

### 10.2 Test Reports
- Daily Test Execution Reports
- Weekly Test Summary Reports
- Defect Reports
- Test Coverage Reports
- Performance Test Reports

### 10.3 Test Artifacts
- ✅ Automated Test Suites
- Test Data
- Configuration Files
- CI/CD Pipeline Configurations

---

## 11. Entry and Exit Criteria

### 11.1 Entry Criteria
- [ ] Test plan approved
- [ ] Test environment ready
- [ ] Test data prepared
- [ ] Application deployed to test environment
- [ ] All blockers resolved

### 11.2 Exit Criteria
- [ ] All planned tests executed
- [ ] 95% test cases passed
- [ ] No critical/high severity bugs open
- [ ] Code coverage > 80%
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Test summary report approved

---

## 12. Suspension and Resumption Criteria

### 12.1 Suspension Criteria
Testing will be suspended if:
- Critical bugs block testing
- Test environment is unavailable
- Build is unstable
- Data corruption occurs

### 12.2 Resumption Criteria
Testing will resume when:
- Blocker bugs are fixed
- Environment is restored
- Stable build is deployed
- Go-ahead from test manager

---

## 13. Test Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database connectivity issues | High | Medium | Use MongoDB Atlas, backup connection strings |
| Flaky UI tests | Medium | High | Add retry logic, use explicit waits |
| Performance degradation | High | Low | Continuous monitoring, load testing |
| Security vulnerabilities | Critical | Medium | Regular security scans, OWASP compliance |
| Incomplete test coverage | Medium | Medium | Code coverage tracking, peer reviews |
| Environment instability | High | Low | Infrastructure as code, automated setup |

---

## 14. Defect Management

### 14.1 Defect Severity Classification
- **Critical**: System crash, data loss, security breach
- **High**: Major feature not working, blocking issue
- **Medium**: Feature partially working, workaround exists
- **Low**: Minor UI issue, cosmetic problem

### 14.2 Defect Priority
- **P0**: Fix immediately (Critical production issues)
- **P1**: Fix within 24 hours
- **P2**: Fix within current sprint
- **P3**: Fix when possible

### 14.3 Defect Workflow
1. Bug discovered during testing
2. Bug logged in issue tracker (GitHub Issues)
3. Bug triaged by team lead
4. Bug assigned to developer
5. Bug fixed and deployed to test environment
6. Bug verified by QA
7. Bug closed or reopened

---

## 15. Test Metrics and Reporting

### 15.1 Key Metrics

**Test Coverage Metrics**:
- Code Coverage: Target > 80%
- Requirement Coverage: 100%
- API Endpoint Coverage: 100%

**Test Execution Metrics**:
- Test Pass Rate: Target > 95%
- Test Execution Time
- Tests Automated: Target > 90%

**Defect Metrics**:
- Defect Density
- Defect Detection Rate
- Defect Resolution Time
- Defect Leakage to Production

**Performance Metrics**:
- Average Response Time
- 95th Percentile Response Time
- Throughput (requests/second)
- Error Rate

### 15.2 Reporting Frequency
- **Daily**: Test execution status, new bugs
- **Weekly**: Test summary, coverage trends
- **Milestone**: Comprehensive test report

---

## 16. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | __________ | __________ | __________ |
| Project Manager | __________ | __________ | __________ |
| Development Lead | __________ | __________ | __________ |
| Product Owner | __________ | __________ | __________ |

---

## Appendix A: Test Data

### Sample Test Users
```json
{
  "admin": {
    "email": "admin@admin.com",
    "password": "admin123",
    "role": "owner"
  },
  "testUser": {
    "email": "test@test.com",
    "password": "test123",
    "role": "user"
  }
}
```

### Sample Customer Data
```json
{
  "company": "Acme Corporation",
  "name": "John",
  "surname": "Smith",
  "email": "john.smith@acme.com",
  "phone": "+1-555-0100",
  "address": "123 Main Street",
  "city": "New York",
  "country": "USA",
  "zipCode": "10001"
}
```

---

## Appendix B: Glossary

- **CI/CD**: Continuous Integration / Continuous Deployment
- **E2E**: End-to-End testing
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete
- **UAT**: User Acceptance Testing
- **SUT**: System Under Test

---

**Document End**
