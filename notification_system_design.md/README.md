
# Stage 1

## API Design

### 1. Get All Notifications

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

---

### 2. Filter by Type

GET /notifications?type=Result

---

### 3. Pagination

GET /notifications?limit=10&page=1

---

## Features

* Fetch notifications
* Filter by type
* Pagination support
* Real-time updates (conceptual)

---

## Schema Design

{
"id": "UUID",
"type": "string",
"message": "string",
"timestamp": "ISO date"
}
