const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// SQLite database setup
const db = new sqlite3.Database('./database/users.db', (err) => {
    if (err) {
        console.error('Failed to connect to SQLite database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
    session({
        secret: process.env.SECRET_KEY || 'default_secret_key',
        resave: false,
        saveUninitialized: true,
    })
);

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }

        if (row) {
            if (password === row.password) {
                req.session.userId = row.id;
                req.session.username = row.username;
                res.send(`<h1>Welcome, ${row.username}!</h1><a href="/logout">Logout</a>`);
            } else {
                res.status(401).send('<h1>Invalid email or password.</h1><a href="/">Try Again</a>');
            }
        } else {
            res.status(401).send('<h1>Invalid email or password.</h1><a href="/">Try Again</a>');
        }
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Listen on all interfaces for Docker
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});