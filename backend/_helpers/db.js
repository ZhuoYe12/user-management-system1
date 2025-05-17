const config = require('../config.json');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    try {
        let sequelize;
        
        if (process.env.DATABASE_URL) {
            // Production: Use DATABASE_URL
            console.log('Connecting to database using DATABASE_URL');
            sequelize = new Sequelize(process.env.DATABASE_URL, {
                dialect: 'postgres',
                logging: (msg) => console.log(`[Database] ${msg}`),
                define: {
                    timestamps: false
                },
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });
        } else {
            // Local development: Use config.json
            const { host, port, user, password, database } = config.database;
            console.log(`Connecting to database: ${database} on ${host}:${port}`);
            
            sequelize = new Sequelize(database, user, password, {
                host,
                port,
                dialect: 'postgres',
                logging: (msg) => console.log(`[Database] ${msg}`),
                define: {
                    timestamps: false
                },
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });
        }

        // Test the connection
        try {
            await sequelize.authenticate();
            console.log('Database connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            // Don't throw here, let the app continue and handle the error gracefully
            console.error('Database connection error details:', {
                message: error.message,
                code: error.code,
                errno: error.errno,
                sqlState: error.sqlState,
                sqlMessage: error.sqlMessage
            });
        }

        // init models and add them to the exported db object
        console.log('Initializing models...');
        try {
            db.Account = require('../accounts/account.model')(sequelize);
            db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
            db.Department = require('../departments/department.model')(sequelize);
            db.Employee = require('../employees/employee.model')(sequelize);
            db.Workflow = require('../workflows/workflow.model')(sequelize);
            db.Request = require('../requests/request.model')(sequelize);
            db.RequestItem = require('../requests/request-item.model')(sequelize);
            console.log('Models initialized successfully');
        } catch (error) {
            console.error('Error initializing models:', error);
            throw error;
        }

        // define relationships
        console.log('Setting up model relationships...');
        try {
            // Account - RefreshToken relationship
            db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
            db.RefreshToken.belongsTo(db.Account);

            // Department - Employee relationship
            db.Department.hasMany(db.Employee, { 
                foreignKey: 'departmentId',
                onDelete: 'SET NULL'
            });
            db.Employee.belongsTo(db.Department, { 
                foreignKey: 'departmentId'
            });

            // Account - Employee relationship  
            db.Account.hasOne(db.Employee, { 
                foreignKey: 'userId', 
                onDelete: 'CASCADE'
            });
            db.Employee.belongsTo(db.Account, { 
                foreignKey: 'userId'
            });

            // Employee - Workflow relationship
            db.Employee.hasMany(db.Workflow, {
                foreignKey: 'employeeId',
                onDelete: 'CASCADE'
            });
            db.Workflow.belongsTo(db.Employee, {
                foreignKey: 'employeeId'
            });

            // Request relationships
            db.Employee.hasMany(db.Request, {
                foreignKey: 'employeeId',
                onDelete: 'CASCADE'
            });
            db.Request.belongsTo(db.Employee, {
                foreignKey: 'employeeId'
            });

            // Request-Items relationship
            db.Request.hasMany(db.RequestItem, {
                foreignKey: 'requestId',
                onDelete: 'CASCADE'
            });
            db.RequestItem.belongsTo(db.Request, {
                foreignKey: 'requestId'
            });

            // Request-Approver relationship
            db.Account.hasMany(db.Request, {
                foreignKey: 'approverId',
                as: 'ApprovedRequests',
                onDelete: 'SET NULL'
            });
            db.Request.belongsTo(db.Account, {
                foreignKey: 'approverId',
                as: 'Approver'
            });
            console.log('Model relationships set up successfully');
        } catch (error) {
            console.error('Error setting up model relationships:', error);
            throw error;
        }

        // sync all models with database
        console.log('Syncing models with database...');
        try {
            await sequelize.sync({ force: false, alter: false });
            console.log('Database sync complete');
        } catch (error) {
            console.error('Error syncing database:', error);
            throw error;
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        // Log detailed error information
        console.error('Detailed error information:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        throw error;
    }
}
