const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body || {};
	if (!name || !email || !password) {
		return res.status(400).json({ message: 'Missing required fields.' });
	}

	const db = req.app.get('db');

	// Check if user with email already exists
	db.get('SELECT 1 FROM users WHERE email = ?', [email], async (selectErr, row) => {
		if (selectErr) {
			return res.status(500).json({ message: 'Internal server error.' });
		}
		if (row) {
			return res.status(409).json({ message: 'Email already in use.' });
		}

		try {
			const passwordHash = await bcrypt.hash(password, 10);
			// Insert new user
			db.run(
				'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
				[name, email, passwordHash],
				function (insertErr) {
					if (insertErr) {
						return res.status(500).json({ message: 'Internal server error.' });
					}
					return res.status(201).json({ message: 'User created successfully.' });
				}
			);
		} catch (hashErr) {
			return res.status(500).json({ message: 'Internal server error.' });
		}
	});
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body || {};
	if (!email || !password) {
		return res.status(400).json({ message: 'Missing required fields.' });
	}

	const db = req.app.get('db');

	// Fetch user by email
	db.get('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email], async (selectErr, user) => {
		if (selectErr) {
			return res.status(500).json({ message: 'Internal server error.' });
		}
		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password.' });
		}

		try {
			const match = await bcrypt.compare(password, user.password_hash);
			if (!match) {
				return res.status(401).json({ message: 'Invalid email or password.' });
			}
			return res.status(200).json({ message: 'Login successful.' });
		} catch (compareErr) {
			return res.status(500).json({ message: 'Internal server error.' });
		}
	});
});

module.exports = router;


