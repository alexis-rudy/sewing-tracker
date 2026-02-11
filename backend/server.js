import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Example route to test database connection
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ solution: rows[0].solution });
    } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});