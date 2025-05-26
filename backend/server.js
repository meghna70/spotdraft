const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fileRoutes = require('./routes/files');
const sharedRoutes = require('./routes/shared');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://lucky-cocada-2f0914.netlify.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/shared', sharedRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
