const bcrypt = require('bcrypt');

exports.seed = async function(connection) {
    // Clear existing data
    await connection.query('DELETE FROM project_tags');
    await connection.query('DELETE FROM tags');
    await connection.query('DELETE FROM progress_entries');
    await connection.query('DELETE FROM projects');
    await connection.query('DELETE FROM users');
    
    // Create sample user
    const passwordHash = await bcrypt.hash('password123', 10);
    const [userResult] = await connection.query(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
        ['demo@example.com', passwordHash, 'Demo User']
    );
    const userId = userResult.insertId;
    
    // Create sample tags
    const [tagResult1] = await connection.query(
        'INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)',
        [userId, 'Quilt', '#EF4444']
    );
    const [tagResult2] = await connection.query(
        'INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)',
        [userId, 'Clothing', '#3B82F6']
    );
    const [tagResult3] = await connection.query(
        'INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)',
        [userId, 'Gift', '#10B981']
    );
    
    // Create sample projects
    const [projectResult1] = await connection.query(
        `INSERT INTO projects (user_id, title, description, status, start_date) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, 'Baby Quilt', 'A colorful baby quilt for my niece', 'in_progress', '2024-01-15']
    );
    const project1Id = projectResult1.insertId;
    
    const [projectResult2] = await connection.query(
        `INSERT INTO projects (user_id, title, description, status, start_date) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, 'Summer Dress', 'Floral pattern summer dress', 'not_started', '2024-02-01']
    );
    const project2Id = projectResult2.insertId;
    
    // Link tags to projects
    await connection.query(
        'INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)',
        [project1Id, tagResult1.insertId]
    );
    await connection.query(
        'INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)',
        [project1Id, tagResult3.insertId]
    );
    await connection.query(
        'INSERT INTO project_tags (project_id, tag_id) VALUES (?, ?)',
        [project2Id, tagResult2.insertId]
    );
    
    // Add progress entries
    await connection.query(
        `INSERT INTO progress_entries (project_id, entry_date, hours_spent, notes) 
         VALUES (?, ?, ?, ?)`,
        [project1Id, '2024-01-16', 2.5, 'Cut fabric pieces']
    );
    await connection.query(
        `INSERT INTO progress_entries (project_id, entry_date, hours_spent, notes) 
         VALUES (?, ?, ?, ?)`,
        [project1Id, '2024-01-20', 3.0, 'Pieced together blocks']
    );
};
