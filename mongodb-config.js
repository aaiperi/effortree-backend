// MongoDB Database Setup Script
// Run with: mongosh "YOUR_CONNECTION_STRING" < mongodb-config.js


// ========================================
// CREATE COLLECTIONS WITH VALIDATION
// ========================================

// USERS COLLECTION
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "role", "created_at"],
      properties: {
        email: {
          bsonType: "string",
          description: "Valid email address required"
        },
        name: {
          bsonType: "string",
          minLength: 1
        },
        role: {
          enum: ["student", "parent", "admin"]
        },
        password: {
          bsonType: "string"
        },
        created_at: {
          bsonType: "string"
        }
      }
    }
  }
});

print("✅ Users collection created");

// QUESTS COLLECTION
db.createCollection("quests", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "title", "subject", "suggested_minutes", "deadline", "status", "created_at"],
      properties: {
        id: {
          bsonType: "string",
          pattern: "^quest_"
        },
        title: {
          bsonType: "string",
          minLength: 1
        },
        description: {
          bsonType: "string"
        },
        subject: {
          bsonType: "string"
        },
        topic: {
          bsonType: "string"
        },
        effort_type: {
          bsonType: "string"
        },
        studied_minutes: {
          bsonType: "int",
          minimum: 0
        },
        suggested_minutes: {
          bsonType: "int",
          minimum: 1
        },
        deadline: {
          bsonType: "string"
        },
        visibility: {
          enum: ["private", "shared"]
        },
        status: {
          enum: ["prepare", "active", "done"]
        },
        created_at: {
          bsonType: "string"
        }
      }
    }
  }
});

print("✅ Quests collection created");

// ========================================
// CREATE INDEXES
// ========================================

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

db.quests.createIndex({ id: 1 }, { unique: true });
db.quests.createIndex({ status: 1 });
db.quests.createIndex({ subject: 1 });
db.quests.createIndex({ deadline: 1 });
db.quests.createIndex({ created_at: -1 });

print("✅ Indexes created");

// ========================================
// INSERT SAMPLE DATA
// ========================================

db.users.insertMany([
  {
    email: "student@effortee.com",
    name: "Sample Student",
    role: "student",
    password: "hashed_password_here",
    created_at: "2025-01-02"
  },
  {
    email: "parent@effortee.com",
    name: "Sample Parent",
    role: "parent",
    password: "hashed_password_here",
    created_at: "2025-01-02"
  }
]);

db.quests.insertMany([
  {
    id: "quest_001",
    title: "Just get started",
    description: "Spend a short focused time. It doesn't have to be perfect.",
    subject: "Math",
    topic: "Algebra basics",
    effort_type: "focus_time",
    studied_minutes: 10,
    suggested_minutes: 20,
    deadline: "2025-02-20",
    visibility: "shared",
    status: "active",
    created_at: "2025-01-02"
  },
  {
    id: "quest_002",
    title: "Complete Chapter 3",
    description: "Read and take notes",
    subject: "Science",
    topic: "Biology",
    effort_type: "reading",
    studied_minutes: 0,
    suggested_minutes: 45,
    deadline: "2025-02-25",
    visibility: "shared",
    status: "prepare",
    created_at: "2025-01-02"
  }
]);

print("\n📊 Setup Complete!");
print("Users: " + db.users.countDocuments());
print("Quests: " + db.quests.countDocuments());