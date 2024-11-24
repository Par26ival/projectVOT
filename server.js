const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

const db = new sqlite3.Database('./database/users.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
require('dotenv').config();
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
    })
);

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
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

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
