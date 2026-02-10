const fs = require('fs');
const path = require('path');

exports.up = async function(connection) {
    const schema = fs.readFileSync(
        path.join(__dirname, '..', 'schema.sql'),
        'utf8'
    );
    
    const statements = schema
        .split(';')
        .filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
        await connection.query(statement);
    }
};

exports.down = async function(connection) {
    await connection.query('DROP TABLE IF EXISTS project_tags');
    await connection.query('DROP TABLE IF EXISTS tags');
    await connection.query('DROP TABLE IF EXISTS progress_entries');
    await connection.query('DROP TABLE IF EXISTS projects');
    await connection.query('DROP TABLE IF EXISTS users');
};
