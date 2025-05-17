require('rootpath')();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./_middleware/error-handler');

// Get the frontend URL from environment variable or use default
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

app.use(cors({
  origin: frontendUrl,
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Add debugging middleware before routes
app.use((req, res, next) => {
    // Log all API requests for debugging
    const requestInfo = {
        method: req.method,
        path: req.path,
        ip: req.ip
    };
    
    if (req.method === 'POST' || req.method === 'PUT') {
        requestInfo.body = req.body;
    }
    
    console.log('API Request:', JSON.stringify(requestInfo, null, 2));
    next();
});

// Add logging middleware to show request bodies
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log(`[${req.method}] ${req.url} - Request body:`, JSON.stringify(req.body));
    }
    next();
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// api routes
app.use('/accounts', require('./accounts/account.controller'));
app.use('/departments', require('./departments/index'));
app.use('/employees', require('./employees/index'));
app.use('/workflows', require('./workflows/index'));
app.use('/requests', require('./requests/index'));  // Make sure this is added

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err);
    
    if (err.stack) {
        console.error('Error stack:', err.stack);
    }
    
    // Add specific handling for Sequelize errors
    if (err.name?.includes('Sequelize')) {
        console.error('Sequelize error details:', {
            name: err.name,
            message: err.message,
            sql: err.sql,
            params: err.parameters
        });
        
        // Return a more informative message for development
        const devMessage = process.env.NODE_ENV === 'development' 
            ? `SQL: ${err.sql || 'N/A'}, Message: ${err.message}` 
            : undefined;
            
        return res.status(400).json({ 
            message: 'Database operation failed',
            error: devMessage
        });
    }
    
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'UnauthorizedError':
            // jwt authentication error
            return res.status(401).json({ message: 'Unauthorized' });
        case err.name === 'SequelizeValidationError':
            // database validation error
            return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
        case err.name === 'SequelizeUniqueConstraintError':
            // unique constraint error
            return res.status(400).json({ message: 'A record with this name already exists' });
        default:
            console.error('Unhandled error:', err);
            return res.status(500).json({ 
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? (err.message || err) : undefined
            });
    }
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});