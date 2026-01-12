const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/winter-activities';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Activity Schema
const activitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    isSnowNeeded: { type: Boolean, required: true }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

// Seed initial data (run once)
async function seedDatabase() {
    const count = await Activity.countDocuments();
    if (count === 0) {
        const initialActivities = [
            { name: "Skiing", price: 75, isSnowNeeded: true },
            { name: "Snowboarding", price: 80, isSnowNeeded: true },
            { name: "Ice Skating", price: 15, isSnowNeeded: false },
            { name: "Sledding", price: 20, isSnowNeeded: true },
            { name: "Snowshoeing", price: 30, isSnowNeeded: true },
            { name: "Hot Chocolate Tour", price: 25, isSnowNeeded: false },
            { name: "Winter Hiking", price: 0, isSnowNeeded: false },
            { name: "Snowman Building", price: 0, isSnowNeeded: true },
            { name: "Ice Fishing", price: 40, isSnowNeeded: false },
            { name: "Dog Sledding", price: 150, isSnowNeeded: true }
        ];
        await Activity.insertMany(initialActivities);
        console.log('Database seeded with initial activities');
    }
}

// Call seed function
//seedDatabase();

// Routes

// CREATE - Add new activity
app.post('/api/activities', async (req, res) => {
    try {
        const { name, price, isSnowNeeded } = req.body;
        
        if (!name || price === undefined || isSnowNeeded === undefined) {
            return res.status(400).json({ error: 'Missing required fields: name, price, isSnowNeeded' });
        }
        
        const activity = new Activity({ name, price, isSnowNeeded });
        await activity.save();
        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ - Get all activities
app.get('/api/activities', async (req, res) => {
    try {
        const activities = await Activity.find();
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Get activity by ID
app.get('/api/activities/:id', async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Get activities by snow requirement
app.get('/api/activities/filter/snow/:required', async (req, res) => {
    try {
        const required = req.params.required === 'true';
        const activities = await Activity.find({ isSnowNeeded: required });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Get free activities
app.get('/api/activities/filter/free', async (req, res) => {
    try {
        const activities = await Activity.find({ price: 0 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - Update activity by ID
app.put('/api/activities/:id', async (req, res) => {
    try {
        const { name, price, isSnowNeeded } = req.body;
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            { name, price, isSnowNeeded },
            { new: true, runValidators: true }
        );
        
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Delete activity by ID
app.delete('/api/activities/:id', async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json({ message: 'Activity deleted successfully', activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/activities`);
    console.log(`MongoDB URI: ${MONGODB_URI}`);
});
