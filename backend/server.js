const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/credential-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3000/dashboard', /^https:\/\/.*\.netlify\.app$/],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Endpoints:');
  console.log('  POST /api/auth/register - Register user');
  console.log('  POST /api/auth/login - Login user');
  console.log('  GET /api/projects - Get all projects (protected)');
  console.log('  POST /api/projects - Create project (protected)');
  console.log('  PUT /api/projects/:id - Update project (protected)');
  console.log('  DELETE /api/projects/:id - Delete project (protected)');
  console.log('  GET /api/health - Health check');
});
