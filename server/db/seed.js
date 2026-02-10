const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSeeds() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sewing_tracker'
    });

    try {
        const seedsDir = path.join(__dirname, 'seeds');
        const files = fs.readdirSync(seedsDir)
            .filter(f => f.endsWith('.js'))
            .sort();

        for (const file of files) {
            console.log(`Running seed: ${file}`);
            const seed = require(path.join(seedsDir, file));
            await seed.seed(connection);
            console.log(`Completed seed: ${file}`);
        }

        console.log('All seeds completed successfully');
    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

runSeeds();
