// MongoDB Database Setup Script
// Run this after MongoDB is installed: mongosh < mongodb-config.js

// ========================================
// CREATE ADMIN USER
// ========================================
db.createUser({
  user: "effortee_admin",
  pwd: "CHANGE_THIS_PASSWORD_123", // ⚠️ Change this in production!
  roles: [
    { role: "readWrite", db: "effortee" },
    { role: "dbAdmin", db: "effortee" }
  ]
});

print("✅ Admin user created");

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
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Valid email address required"
        },
        name: {
          bsonType: "string",
          minLength: 1,
          description: "User name required"
        },
        role: {
          enum: ["student", "parent", "admin"],
          description: "Role must be student, parent, or admin"
        },
        password: {
          bsonType: "string",
          description: "Hashed password"
        },
        created_at: {
          bsonType: "string",
          description: "Creation date in YYYY-MM-DD format"
        }
      }
    }
  }
});

print("✅ Users collection created");

// QUESTS COLLECTION (matching your schema)
db.createCollection("quests", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "title", "subject", "suggested_minutes", "deadline", "status", "created_at"],
      properties: {
        id: {
          bsonType: "string",
          pattern: "^quest_",
          description: "Quest ID starting with 'quest_'"
        },
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200,
          description: "Quest title required"
        },
        description: {
          bsonType: "string",
          description: "Optional quest description"
        },
        subject: {
          bsonType: "string",
          description: "Subject area (e.g., Math, Science)"
        },
        topic: {
          bsonType: "string",
          description: "Specific topic within subject"
        },
        effort_type: {
          bsonType: "string",
          description: "Type of effort (e.g., focus_time)"
        },
        studied_minutes: {
          bsonType: "int",
          minimum: 0,
          description: "Minutes already studied"
        },
        suggested_minutes: {
          bsonType: "int",
          minimum: 1,
          description: "Suggested study duration in minutes"
        },
        deadline: {
          bsonType: "string",
          pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
          description: "Deadline in YYYY-MM-DD format"
        },
        visibility: {
          enum: ["private", "shared"],
          description: "Quest visibility setting"
        },
        status: {
          enum: ["prepare", "active", "done"],
          description: "Quest status: prepare, active, or done"
        },
        created_at: {
          bsonType: "string",
          pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$",
          description: "Creation date in YYYY-MM-DD format"
        }
      }
    }
  }
});

print("✅ Quests collection created");

// ========================================
// CREATE INDEXES FOR PERFORMANCE
// ========================================

// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

print("✅ User indexes created");

// Quest indexes
db.quests.createIndex({ id: 1 }, { unique: true });
db.quests.createIndex({ status: 1 });
db.quests.createIndex({ subject: 1 });
db.quests.createIndex({ deadline: 1 });
db.quests.createIndex({ created_at: -1 });
db.quests.createIndex({ status: 1, deadline: 1 }); // Compound index

print("✅ Quest indexes created");

// ========================================
// INSERT SAMPLE DATA
// ========================================

// Sample users
db.users.insertMany([
  {
    email: "student1@effortee.com",
    name: "Alice Student",
    role: "student",
    password: "hashed_password_here", // In production, use bcrypt
    created_at: "2025-01-15"
  },
  {
    email: "parent1@effortee.com",
    name: "Bob Parent",
    role: "parent",
    password: "hashed_password_here",
    created_at: "2025-01-15"
  }
]);

print("✅ Sample users inserted");

// Sample quests
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
    created_at: "2025-02-18"
  },
  {
    id: "quest_002",
    title: "Complete Chapter 3",
    description: "Read and take notes on Chapter 3",
    subject: "Science",
    topic: "Biology - Cell Structure",
    effort_type: "reading",
    studied_minutes: 0,
    suggested_minutes: 45,
    deadline: "2025-02-25",
    visibility: "shared",
    status: "prepare",
    created_at: "2025-02-18"
  },
  {
    id: "quest_003",
    title: "Practice Problems",
    description: "Complete 20 practice problems from workbook",
    subject: "Math",
    topic: "Quadratic Equations",
    effort_type: "practice",
    studied_minutes: 30,
    suggested_minutes: 60,
    deadline: "2025-02-22",
    visibility: "private",
    status: "active",
    created_at: "2025-02-17"
  }
]);

print("✅ Sample quests inserted");

// ========================================
// VERIFY SETUP
// ========================================

print("\n📊 Database Setup Summary:");
print("─────────────────────────────────");
print("Users count: " + db.users.countDocuments());
print("Quests count: " + db.quests.countDocuments());
print("\n✨ MongoDB configuration complete!");
print("⚠️  Remember to change the admin password in production!");