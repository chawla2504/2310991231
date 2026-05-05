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
# Stage 3

## Indexing

CREATE INDEX idx_type ON notifications(type);
CREATE INDEX idx_timestamp ON notifications(timestamp);


## Optimization Techniques

- Use indexing on frequently queried fields (type, timestamp)
- Use pagination to limit data load
- Order results using indexed columns
- Avoid full table scans

-- Filter by type
SELECT * FROM notifications
WHERE type = 'Result'
ORDER BY timestamp DESC;

-- Pagination
SELECT * FROM notifications
ORDER BY timestamp DESC
LIMIT 10 OFFSET 0;

# Stage 4

## Performance Improvements

- Use caching for frequently accessed notifications
- Limit API response size using pagination
- Optimize database queries using indexes
- Use asynchronous processing for heavy operations
- Reduce response time by minimizing data fields
