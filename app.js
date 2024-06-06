const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'chandan@28',
    database: 'airline'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Endpoint to get flights
app.get('/get-flights', (req, res) => {
    const sql = 'SELECT * FROM flights';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to book a flight
app.post('/book-flight', (req, res) => {
    const { name, dob, gender, phone_no, email, flightId } = req.body;
    const sql = 'INSERT INTO passengers (name, dob, gender, phone_no, email, flight_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, dob, gender, phone_no, email, flightId], (err, result) => {
        if (err) throw err;
        res.send('Flight booked successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
