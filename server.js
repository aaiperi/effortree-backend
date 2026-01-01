const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
let db;

MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db('effortee');
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Helper function to generate quest ID
function generateQuestId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `quest_${timestamp}${random}`;
}

// ========================================
// USER ENDPOINTS
// ========================================

// GET /v1/users/ - Get all user profiles
app.get('/v1/users/', async (req, res) => {
  try {
    const users = await db.collection('users')
      .find({})
      .project({ password: 0 }) // Don't send passwords
      .toArray();

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /v1/users/:id - Get single user profile
app.get('/v1/users/:id', async (req, res) => {
  try {
    const user = await db.collection('users')
      .findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { password: 0 } }
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========================================
// QUEST ENDPOINTS (MATCHING YOUR SCHEMA)
// ========================================

// POST /v1/quest/ - Add new quest
app.post('/v1/quest/', async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      topic,
      effort_type,
      studied_minutes = 0,
      suggested_minutes,
      deadline,
      visibility = 'shared',
      status = 'prepare'
    } = req.body;

    // Validation
    if (!title || !subject || !suggested_minutes || !deadline) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, subject, suggested_minutes, deadline'
      });
    }

    // Create quest with your exact schema
    const newQuest = {
      id: generateQuestId(),
      title,
      description: description || '',
      subject,
      topic: topic || '',
      effort_type: effort_type || 'focus_time',
      studied_minutes,
      suggested_minutes: parseInt(suggested_minutes),
      deadline,
      visibility,
      status, // prepare | active | done
      created_at: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };

    const result = await db.collection('quests').insertOne(newQuest);

    res.status(201).json({
      success: true,
      message: 'Quest created successfully',
      quest: { ...newQuest, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating quest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /v1/quest/ - Get all quests (with optional filters)
app.get('/v1/quest/', async (req, res) => {
  try {
    const { status, subject, visibility, deadline_before, deadline_after } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    if (visibility) filter.visibility = visibility;
    
    // Date range filtering
    if (deadline_before || deadline_after) {
      filter.deadline = {};
      if (deadline_before) filter.deadline.$lte = deadline_before;
      if (deadline_after) filter.deadline.$gte = deadline_after;
    }

    const quests = await db.collection('quests')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    res.json({
      success: true,
      count: quests.length,
      quests
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /v1/quest/:id - Get single quest
app.get('/v1/quest/:id', async (req, res) => {
  try {
    const quest = await db.collection('quests')
      .findOne({ id: req.params.id });

    if (!quest) {
      return res.status(404).json({
        success: false,
        error: 'Quest not found'
      });
    }

    res.json({
      success: true,
      quest
    });
  } catch (error) {
    console.error('Error fetching quest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH /v1/quest/:id - Update quest
app.patch('/v1/quest/:id', async (req, res) => {
  try {
    const allowedUpdates = [
      'title',
      'description',
      'subject',
      'topic',
      'effort_type',
      'studied_minutes',
      'suggested_minutes',
      'deadline',
      'visibility',
      'status'
    ];

    // Filter only allowed fields
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    const result = await db.collection('quests').findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Quest not found'
      });
    }

    res.json({
      success: true,
      message: 'Quest updated successfully',
      quest: result
    });
  } catch (error) {
    console.error('Error updating quest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /v1/quest/:id - Delete quest
app.delete('/v1/quest/:id', async (req, res) => {
  try {
    const result = await db.collection('quests')
      .deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Quest not found'
      });
    }

    res.json({
      success: true,
      message: 'Quest deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quest:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========================================
// ANALYTICS ENDPOINTS
// ========================================

// GET /v1/quest/stats - Get quest statistics
app.get('/v1/quest/stats', async (req, res) => {
  try {
    const totalQuests = await db.collection('quests').countDocuments();
    const activeQuests = await db.collection('quests').countDocuments({ status: 'active' });
    const doneQuests = await db.collection('quests').countDocuments({ status: 'done' });
    
    const totalMinutesStudied = await db.collection('quests')
      .aggregate([
        { $group: { _id: null, total: { $sum: '$studied_minutes' } } }
      ]).toArray();

    res.json({
      success: true,
      stats: {
        total_quests: totalQuests,
        active_quests: activeQuests,
        completed_quests: doneQuests,
        total_minutes_studied: totalMinutesStudied[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========================================
// HEALTH CHECK
// ========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: db ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Effortee Backend Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Port: ${PORT}
🗄️  Database: ${db ? '✅ Connected' : '❌ Disconnected'}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});