const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kar@1211',
    database: 'airlines'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

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
        res.sendFile(path.join(__dirname, 'passenger.html'));
    });
});

// Endpoint to save services
app.post('/save-services', (req, res) => {
    const { flightId, foodIncluded, foodType, entertainmentIncluded, seatClass, numPassengers, totalPrice } = req.body;

    const sql = `
        INSERT INTO services (flight_id, food_included, food_type, entertainment_included, seat_class, num_passengers, total_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [flightId, foodIncluded, foodType, entertainmentIncluded, seatClass, numPassengers, totalPrice], (err, result) => {
        if (err) {
            console.error('Error inserting service details:', err);
            res.status(500).send({ success: false, error: err });
        } else {
            res.send({ success: true });
        }
    });
});

// Endpoint to store passenger details in the database
app.post('/save-passenger-details', (req, res) => {
    const passengers = req.body.passengers;
    const values = passengers.map(passenger => [
        passenger.flightId,
        passenger.name,
        passenger.dob,
        passenger.gender,
        passenger.phone_no,
        passenger.email
    ]);

    const sql = 'INSERT INTO passengers (flightId, name, dob, gender, phone_no, email) VALUES ?';
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Error saving passengers:', err);
            res.status(500).json({ success: false, error: err });
        } else {
            console.log('Passengers saved:', result);
            res.status(200).json({ success: true });
        }
    });
});

// Endpoint to handle flight creation
app.post('/submit-flight', (req, res) => {
    const {
        airplane_code, airplane_name, departure, arrival,
        departure_date, departure_time, arrival_date, arrival_time,
        total_seats, price
    } = req.body;

    const sql = `
        INSERT INTO flights (airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, total_seats, price) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [airplane_code, airplane_name, departure, arrival, departure_date, departure_time, arrival_date, arrival_time, total_seats, price], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Failed to save flight details to the database');
        } else {
            res.send('Flight details saved to database');
        }
    });
});

// Endpoint to get airplanes
app.get('/get-airplanes', (req, res) => {
    const sql = 'SELECT id, name FROM airplanes';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to update flight seats
app.post('/update-seats', (req, res) => {
    const { flightId, numPassengers } = req.body;
    const sql = 'UPDATE flights SET total_seats = total_seats - ? WHERE id = ?';
    db.query(sql, [numPassengers, flightId], (err, result) => {
        if (err) {
            console.error('Error updating seats:', err);
            res.status(500).send('Failed to update seats');
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/search-flights', (req, res) => {
    const { departure, arrival, departure_date } = req.query;
    const sql = 'SELECT * FROM flights WHERE departure = ? AND arrival = ? AND departure_date = ?';
    db.query(sql, [departure, arrival, departure_date], (err, results) => {
        if (err) {
            console.error('Error fetching flight details:', err);
            res.status(500).send('Failed to fetch flight details');
        } else {
            res.json(results);
        }
    });
});



       

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
