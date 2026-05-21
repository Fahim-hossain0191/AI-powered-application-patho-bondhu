const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' })); // ছবির জন্য limit বাড়ানো
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/math', require('./modules/math/chapter/chapter.routes'));
app.use('/api/math', require('./modules/math/concept/concept.routes'));
app.use('/api/math', require('./modules/math/formula/formula.routes'));
app.use('/api/math', require('./modules/math/srijonshil/srijonshil.routes'));
app.use('/api/math', require('./modules/math/exercise/exercise.routes'));
app.use('/api/math/hint', require('./modules/math/hint/hint.routes'));
app.use('/api/math', require('./modules/math/mcq/mcq.routes'));
app.use('/api/math/jachai', require('./modules/math/jachai/jachai.routes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'পাঠবন্ধু Backend চলছে!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route পাওয়া যায়নি' });
});

module.exports = app;