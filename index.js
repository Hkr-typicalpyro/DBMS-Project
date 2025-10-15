const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite DB (file-based in project root)
const dbFilePath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFilePath);

// Ensure users table exists
db.run(
	`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`
);

// Attach db to app for routers
app.set('db', db);

// Mount routers
app.use('/api/auth', authRouter);

// Basic health endpoint
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});


