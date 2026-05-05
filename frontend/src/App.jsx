import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Using the same logging endpoint from the frontend
const LOGGING_URL = 'http://20.207.122.201/evaluation-service/logs';
const TOKEN = import.meta.env.VITE_TOKEN; // Vite uses VITE_ prefix

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to send logs from the frontend
  const sendLog = async (level, message) => {
    if (!TOKEN) return;
    try {
      await axios.post(
        LOGGING_URL,
        {
          stack: new Error().stack,
          level,
          package: 'notification_app_fe',
          message,
        },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
    } catch (err) {
      console.error('Failed to send frontend log', err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    await sendLog('info', 'Fetch Notifications button clicked');

    try {
      // Connects to your Express Backend
      const response = await axios.get('http://localhost:3000/notifications');
      setNotifications(response.data.data);
      
      await sendLog('info', `Successfully fetched ${response.data.data.length} notifications`);
    } catch (error) {
      console.error('Error fetching data:', error);
      await sendLog('error', `Failed to fetch notifications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Notification Dashboard</h1>
      
      <button 
        onClick={fetchNotifications} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer', marginBottom: '20px' }}
      >
        {loading ? 'Fetching...' : 'Fetch Notifications'}
      </button>

      {notifications.length === 0 ? (
        <p>No notifications found. Click the button to fetch or add some via API!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((notif) => (
            <li 
              key={notif.id} 
              style={{ 
                border: '1px solid #ccc', 
                padding: '15px', 
                marginBottom: '10px', 
                borderRadius: '5px' 
              }}
            >
              <strong>Type:</strong> {notif.type} <br />
              <strong>Message:</strong> {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
