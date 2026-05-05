require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// Import the reusable logging function
const Log = require('../logging_middleware/logger');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'notifications_db',
});

// POST /notifications -> Create a new notification
app.post('/notifications', async (req, res) => {
    await Log(new Error().stack, 'info', 'notification_app_be', 'POST /notifications API started');
    
    try {
        const { type, message } = req.body;
        
        if (!type || !message) {
            await Log(new Error().stack, 'warn', 'notification_app_be', 'Missing type or message in POST /notifications');
            return res.status(400).json({ error: 'Type and message are required' });
        }

        const id = uuidv4();
        const query = 'INSERT INTO notifications (id, type, message, timestamp) VALUES (?, ?, ?, NOW())';
        await pool.query(query, [id, type, message]);

        await Log(new Error().stack, 'info', 'notification_app_be', `Notification created successfully with id ${id}`);
        res.status(201).json({ message: 'Notification created', id });
    } catch (error) {
        await Log(error.stack, 'error', 'notification_app_be', `Database error in POST: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /notifications -> Fetch notifications with pagination & filtering
app.get('/notifications', async (req, res) => {
    await Log(new Error().stack, 'info', 'notification_app_be', 'GET /notifications API started');

    try {
        const { type, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM notifications';
        let queryParams = [];

        if (type) {
            query += ' WHERE type = ?';
            queryParams.push(type);
        }

        query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(query, queryParams);

        await Log(new Error().stack, 'info', 'notification_app_be', `Fetched ${rows.length} notifications`);
        res.status(200).json({ data: rows, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        await Log(error.stack, 'error', 'notification_app_be', `Database error in GET: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Backend server running on port ${PORT}`);
    await Log(new Error().stack, 'info', 'notification_app_be', `Server started on port ${PORT}`);
});
