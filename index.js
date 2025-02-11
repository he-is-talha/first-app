import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;


const PORT = 3000;

// PostgreSQL Database Connection
const pool = new Pool({
    user: 'postgres',
    host: 'db',  // Service name from docker-compose
    database: 'mydb',
    password: 'postgres',
    port: 5432,
});

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.status(201).json("Good health");
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
    }
});

// Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
    }
});

// Create a new user
app.post('/api/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on PORT:${PORT}`);
});
