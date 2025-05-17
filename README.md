# User Management System

A modern user management system built with Angular and Node.js, featuring user authentication, role-based access control, and email verification.

## Features

- 🔐 Secure user authentication
- 📧 Email verification system
- 👥 User management dashboard
- 🔑 Role-based access control
- 📱 Responsive design
- 🔄 Real-time updates

## Tech Stack

### Frontend
- Angular 17
- Angular Material
- TypeScript
- SCSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- PostgreSQL (v14 or higher)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ZhuoYe12/user-management-system1.git
cd user-management-system1
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Backend Setup
```bash
cd backend
npm install
```

### 4. Environment Configuration

#### Frontend (.env)
Create a `.env` file in the frontend directory:
```env
API_URL=http://localhost:3000
```

#### Backend (.env)
Create a `.env` file in the backend directory:
```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/user_management_db
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### 5. Database Setup
1. Create a PostgreSQL database named `user_management_db`
2. Run the database migrations:
```bash
cd backend
npm run migrate
```

## Running the Application

### Development Mode

1. Start the Backend Server:
```bash
cd backend
npm run dev
```

2. Start the Frontend Development Server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Deployment

### Deploying to Vercel (Frontend)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy the Frontend:
```bash
cd frontend
vercel
```

### Deploying to Render (Backend)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables: Add all variables from your backend `.env` file

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify user email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Management Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [your-email@example.com] or open an issue in the GitHub repository.

## Acknowledgments

- Angular Material for the UI components
- Node.js community for the backend framework
- PostgreSQL for the database

## Testing
### **Functional testing results:** [https://docs.google.com/document/d/1zkrHnNJTvbq-L289UgOpzY6RdiAnttoRgajw37rYZjw/edit?tab=t.0]

---
### **Security Testing Documentation**
#### 1. XSS (Cross-Site Scripting)
- **Status:** ❌ Vulnerable
- **Location:** `fake-backend.ts`
- **Risk Level:** High
- **Details:** Unsanitized HTML content rendering in alert messages
```typescript
alertService.info(`
    <h4>Email Already Registered</h4>
    <p>Your email <strong>${account.email}</strong> is already registered.</p>
`);
```
- **Recommendation:** Implement Angular's DomSanitizer
```typescript
// filepath: src/app/services/alert.service.ts
import { DomSanitizer, SecurityContext } from '@angular/platform-browser';

export class AlertService {
  constructor(private sanitizer: DomSanitizer) {}

  info(content: string): void {
    const sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, content);
    // Display sanitized content
  }
}
```
- DomSanitizer strips potentially dangerous HTML/JavaScript
- Prevents execution of malicious scripts while preserving legitimate formatting

---
#### 2. CSRF Protection
- **Status:** ❌ Missing
- **Risk Level:** Critical
- **Impact:** Vulnerable to cross-site request forgery attacks
- **Recommendation:** Implement CSRF tokens using csurf middleware
```javascript
// filepath: src/server.js
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});
```
**Angular Integration**
```javascript
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
  })
};
```
- Generates unique CSRF token per session
- Prevents cross-site request forgery attacks
- Attacker's site cannot access/replicate token

---
#### 3. Security Headers
- **Status:** ❌ Missing
- **Risk Level:** High
- **Details:** Basic security headers not configured
- **Recommendation:** Implement Helmet middleware
```javascript
// filepath: src/server.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```
- Sets critical security headers
- Prevents various attack vectors including XSS and clickjacking
- Forces HTTPS connections
- Controls resource loading sources

---
#### 4. Input Validation
- **Status:** ⚠️ Partial Implementation
- **Risk Level:** Medium
- **Location:** `src/controllers/user.controller.ts`
- **Details:** Incomplete validation on user input
- **Recommendation:** Strengthen validation rules
```typescript
// filepath: src/validators/user.validator.ts
import * as Joi from 'joi';

export const userValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required(),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
});
```
- Validates all input before processing
- Enforces strict data format rules
- Prevents injection attacks
- Provides clear error messages

---
#### 5. Rate Limiting
- **Status:** ❌ Missing
- **Risk Level:** High
- **Impact:** Vulnerable to brute force attacks
- **Recommendation:** Implement rate limiting for API endpoints
```javascript
// filepath: src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes'
});

app.use('/api/auth/login', loginLimiter);
```
- Tracks requests by IP address
- Blocks excessive attempts
- Prevents brute force attacks
- Different limits for different endpoints

---
#### 6. Password Policy
- **Status:** ⚠️ Weak
- **Location:** `src/services/auth.service.js`
- **Details:** Minimal password requirements
- **Recommendation:** Enhance password complexity rules
```javascript
// filepath: src/services/auth.service.js
const passwordSchema = Joi.string()
  .min(8)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*#?&]{8,}$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character'
  });
```
- Enforces strong password requirements
- Requires mixed case, numbers, and special characters
- Minimum length of 8 characters
- Provides clear error messages

## Contributing
* **Durano, Jhanna Kris** : Responsible for managing the main branch, reviewing pull requests, and ensuring smooth integration.
Backend Developers (2 members):
* **Real, Rovic Steve**: Implement email sign-up, verification, and authentication. In continuation, implemented workflows and requests.
* **Ocliasa, Niño Rollane**: Implement role-based authorization, forgot password/reset password, and CRUD operations. In continuation, implemented employees and departments.
Frontend Developers (2 members):
* **Durano, Jhanna Kris**: Implement email sign-up, verification, and authentication. In continuation, implemented the fake backend.
* **Arcana, Sean Joseph**: Implement profile management, admin dashboard, and fake backend. In continuation, implemented the structure of ui (html).
Testers (2 members):
* **Real, Rovic Steve**:: Perform functional testing and validate user flows.
* **Ocliasa, Niño Rollane**: Perform security testing and validate edge cases.

## License
### MIT License

---
### **Best Practices**
1. **Commit Often:** Make small, frequent commits with clear messages to track progress.
2. **Use Descriptive Branch Names:** Name branches based on their purpose.
3. **Review Code Before Merging:** Always review pull requests to ensure code quality.
4. **Keep Branches Updated:** Regularly pull changes from `main` to avoid large conflicts.
5. **Communicate with Your Team:** Use GitHub issues or comments to discuss tasks and updates.
---
### **Deliverables**
1. A fully functional **Node.js + MySQL - Boilerplate APILinks to an external site.** backend with:
- Email sign-up and verification.
- JWT authentication with refresh tokens.
- Role-based authorization.
- Forgot password and reset password functionality.
- CRUD operations for managing accounts.
2. A fully functional **Angular 10 (17 updated) BoilerplateLinks to an external site.** frontend with:
- Email sign-up and verification.
- JWT authentication with refresh tokens.
- Role-based authorization.
- Profile management.
- Admin dashboard for managing accounts.
- **Fake backend** implementation for backend-less development.
3. A clean and well-maintained GitHub repository with:
- Proper branching structure.
- Reviewed and merged pull requests.
- Resolved merge conflicts.
4. Comprehensive **README.md documentation** covering installation, usage, testing, and contributing guidelines.
5. Test reports from **testers** ensuring the application is functional and secure.
---
### **Evaluation Criteria**
Each team member will be evaluated individually based on:
1. **Code Quality:** Clean, modular, and well-documented code.
2. **Functionality:** Correct implementation of assigned features.
3. **Collaboration:** Effective use of Git and GitHub for collaboration.
4. **Problem-Solving:** Ability to resolve merge conflicts and debug issues.
5. **Testing:** Thoroughness of testing and quality of test reports.
---