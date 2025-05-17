# User Management System

A modern, secure user management system built with Angular 17 and Node.js, featuring comprehensive user authentication, role-based access control, and email verification.

## 🌟 Features

- 🔐 Secure user authentication with JWT
- 📧 Email verification system
- 👥 User management dashboard
- 🔑 Role-based access control
- 📱 Responsive design with Angular Material
- 🔄 Real-time updates
- 🔒 Security features (XSS protection, CSRF tokens, Rate limiting)
- 📊 Admin dashboard for user management
- 👤 Profile management
- 🔄 Password reset functionality

## 🛠 Tech Stack

### Frontend
- Angular 17
- Angular Material
- TypeScript
- SCSS
- RxJS
- NgRx (State Management)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Nodemailer (Email Service)
- Bcrypt (Password Hashing)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- PostgreSQL (v14 or higher)
- Git

## 🚀 Installation

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

## 🏃‍♂️ Running the Application

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

## 🚀 Deployment

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

## 📚 API Documentation

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

## 🔒 Security Features

### 1. XSS Protection
- Implemented Angular's DomSanitizer
- Sanitizes HTML content
- Prevents malicious script execution

### 2. CSRF Protection
- CSRF tokens using csurf middleware
- Token validation on all POST/PUT/DELETE requests
- Secure cookie handling

### 3. Security Headers
- Helmet middleware implementation
- Content Security Policy
- HSTS enabled
- Frame guard protection

### 4. Input Validation
- Joi validation schemas
- Strict data format rules
- Comprehensive error messages

### 5. Rate Limiting
- Express rate limiter
- IP-based request tracking
- Configurable limits per endpoint

### 6. Password Policy
- Minimum 8 characters
- Mixed case requirements
- Special character requirements
- Number requirements

## 👥 Team Members

### Project Manager
* **Durano, Jhanna Kris**
  - Main branch management
  - Pull request reviews
  - Integration oversight

### Backend Developers
* **Real, Rovic Steve**
  - Email sign-up and verification
  - Authentication implementation
  - Workflow and request handling

* **Ocliasa, Niño Rollane**
  - Role-based authorization
  - Password reset functionality
  - CRUD operations
  - Employee and department management

### Frontend Developers
* **Durano, Jhanna Kris**
  - Email sign-up and verification
  - Authentication implementation
  - Fake backend implementation

* **Arcana, Sean Joseph**
  - Profile management
  - Admin dashboard
  - UI structure and implementation

### Testers
* **Real, Rovic Steve**
  - Functional testing
  - User flow validation

* **Ocliasa, Niño Rollane**
  - Security testing
  - Edge case validation

## 📋 Deliverables

1. **Backend Implementation**
   - Email sign-up and verification
   - JWT authentication with refresh tokens
   - Role-based authorization
   - Password reset functionality
   - CRUD operations

2. **Frontend Implementation**
   - Email sign-up and verification
   - JWT authentication
   - Role-based authorization
   - Profile management
   - Admin dashboard
   - Fake backend for development

3. **Repository Management**
   - Proper branching structure
   - Reviewed pull requests
   - Resolved merge conflicts

4. **Documentation**
   - Installation guide
   - Usage instructions
   - Testing procedures
   - Contributing guidelines

5. **Testing**
   - Functional test reports
   - Security test reports

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, email [your-email@example.com] or open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Angular Material for the UI components
- Node.js community for the backend framework
- PostgreSQL for the database
- All contributors and team members

## 🔍 Testing Documentation

### Functional Testing
- [View Functional Testing Results](https://docs.google.com/document/d/1zkrHnNJTvbq-L289UgOpzY6RdiAnttoRgajw37rYZjw/edit?tab=t.0)

### Security Testing
Detailed security testing documentation is available in the project's security documentation.
