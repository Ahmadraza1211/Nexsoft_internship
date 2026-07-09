const express = require('express');
const cors = require('cors');
const moviesRouter = require('./routes/movies');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', moviesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎬 Movie Search API running on http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/search?q=batman`);
});