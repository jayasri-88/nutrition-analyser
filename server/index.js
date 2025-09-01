import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/uploadRoutes.js';
import analyzeRoutes from './routes/analyze.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ replaces bodyParser.json()
app.use(express.urlencoded({ extended: true })); // ✅ replaces bodyParser.urlencoded()

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Server Listener
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
