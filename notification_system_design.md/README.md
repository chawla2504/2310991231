# Stage 1

## API Design

GET /notifications

Response:
{
  "notifications": [
    {
      "id": "string",
      "type": "Event | Result | Placement",
      "message": "string",
      "timestamp": "datetime"
    }
  ]
}

GET /notifications?type=Result

GET /notifications?limit=10&page=1


## Schema Design

{
  "id": "UUID",
  "type": "string",
  "message": "string",
  "timestamp": "ISO date"
}


# Stage 2

## Database Design

Table: notifications

columns:
id (UUID, Primary Key)
type (VARCHAR)
message (TEXT)
timestamp (TIMESTAMP)


## SQL Queries

-- Insert notification
INSERT INTO notifications (id, type, message, timestamp)
VALUES ('uuid', 'Result', 'Result declared', NOW());

-- Get all notifications
SELECT * FROM notifications
ORDER BY timestamp DESC;

-- Filter by type
SELECT * FROM notifications
WHERE type = 'Result'
ORDER BY timestamp DESC;

-- Pagination
SELECT * FROM notifications
ORDER BY timestamp DESC
LIMIT 10 OFFSET 0;
