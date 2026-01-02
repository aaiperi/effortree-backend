# 🎓 Effortee Backend API

Quest management system for students to track their study efforts.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)

### Installation
```bash
npm install
```

### Environment Variables

Create `.env` file:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=production
```

### Run Locally
```bash
npm start
```

## 📡 API Endpoints

### Base URL
```
Production: https://effortee-backend.onrender.com
Local: http://localhost:3000
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-02T12:00:00.000Z",
  "mongodb": "connected"
}
```

---

## 👥 User Endpoints

### Get All Users
```http
GET /v1/users/
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "users": [...]
}
```

### Get Single User
```http
GET /v1/users/:id
```

---

## 📝 Quest Endpoints

### Create Quest
```http
POST /v1/quest/
Content-Type: application/json

{
  "title": "Just get started",
  "description": "Spend a short focused time",
  "subject": "Math",
  "topic": "Algebra basics",
  "effort_type": "focus_time",
  "studied_minutes": 0,
  "suggested_minutes": 20,
  "deadline": "2025-02-20",
  "visibility": "shared",
  "status": "prepare"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quest created successfully",
  "quest": {
    "id": "quest_abc123",
    ...
  }
}
```

### Get All Quests
```http
GET /v1/quest/

# With filters:
GET /v1/quest/?status=active
GET /v1/quest/?subject=Math
GET /v1/quest/?visibility=shared
```

### Get Single Quest
```http
GET /v1/quest/:id
```

### Update Quest
```http
PATCH /v1/quest/:id
Content-Type: application/json

{
  "studied_minutes": 15,
  "status": "active"
}
```

### Delete Quest
```http
DELETE /v1/quest/:id
```

### Get Statistics
```http
GET /v1/quest/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_quests": 10,
    "by_status": {
      "prepare": 3,
      "active": 5,
      "done": 2
    },
    "minutes": {
      "studied": 150,
      "suggested": 300,
      "completion_rate": "50.00%"
    }
  }
}
```

---

## 📊 Quest Schema
```javascript
{
  "id": "quest_001",              // Auto-generated
  "title": "String (required)",
  "description": "String",
  "subject": "String (required)",
  "topic": "String",
  "effort_type": "String",
  "studied_minutes": 0,           // Number
  "suggested_minutes": 20,        // Number (required)
  "deadline": "2025-02-20",       // YYYY-MM-DD (required)
  "visibility": "shared|private",
  "status": "prepare|active|done", // (required)
  "created_at": "2025-01-02"      // Auto-generated
}
```

---

## 🔧 Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing

Use the included test file or test with curl:
```bash
# Health check
curl https://effortee-backend.onrender.com/health

# Create quest
curl -X POST https://effortee-backend.onrender.com/v1/quest/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","subject":"Math","suggested_minutes":30,"deadline":"2025-03-01"}'

# Get all quests
curl https://effortee-backend.onrender.com/v1/quest/
```

---

## 👨‍💻 Developer

**Aiperi Aibekova**
- Tasks: GCP compute engine research, MongoDB server, Quest API

**Frontend Integration (Minsu Choi)**
- Tasks: UI development for quest tables, login, analytics

---

## 📄 License

MIT

---

## 🐛 Known Issues / Limitations

- Free tier on Render: app sleeps after 15min inactivity (30sec wake time)
- Use UptimeRobot to keep it awake if needed

---

## 🔮 Future Enhancements

- [ ] User authentication (JWT)
- [ ] Password hashing (bcrypt)
- [ ] File upload for quest attachments
- [ ] Real-time notifications
- [ ] Analytics dashboard