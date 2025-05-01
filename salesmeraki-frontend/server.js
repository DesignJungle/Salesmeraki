const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;  // Changed from 9000 to 3001

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Mock backend server is running');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple mock authentication
  if (email && password) {
    const token = jwt.sign(
      { id: '123', email },
      'mock-secret-key',
      { expiresIn: '1h' }
    );
    
    res.json({
      user: {
        id: '123',
        email,
        name: 'Mock User',
        role: 'admin'
      },
      accessToken: token
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// User endpoints
app.get('/api/users/me', (req, res) => {
  res.json({
    id: '123',
    email: 'user@example.com',
    name: 'Mock User',
    role: 'admin',
    createdAt: new Date().toISOString()
  });
});

// Workflow endpoints
app.get('/api/workflows', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Sample Workflow',
      description: 'A sample workflow',
      status: 'active',
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock backend server running on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
});
