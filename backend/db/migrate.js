const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sewing_tracker'
    });

    try {
        // Create migrations tracking table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Get list of migrations
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.js'))
            .sort();

        // Check which migrations have been run
        const [executed] = await connection.query(
            'SELECT name FROM migrations'
        );
        const executedNames = new Set(executed.map(row => row.name));

        // Run pending migrations
        for (const file of files) {
            if (!executedNames.has(file)) {
                console.log(`Running migration: ${file}`);
                const migration = require(path.join(migrationsDir, file));
                await migration.up(connection);
                await connection.query(
                    'INSERT INTO migrations (name) VALUES (?)',
                    [file]
                );
                console.log(`Completed migration: ${file}`);
            }
        }

        console.log('All migrations completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

runMigrations();
