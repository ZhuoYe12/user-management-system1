require('rootpath')();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./_middleware/error-handler');

const app = express();

// Get the frontend URLs from environment variable or use defaults
const allowedOrigins = [
    'https://user-management-system-nine.vercel.app',
    'http://localhost:4200'
];

// Configure CORS
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
        ip: req.ip,
        origin: req.headers.origin
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
app.use('/requests', require('./requests/index'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString()
    });
});

// global error handler
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Allowed origins:', allowedOrigins);
});