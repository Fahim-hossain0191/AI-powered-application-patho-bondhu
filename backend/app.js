const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const passport     = require('./config/passport');
const corsOptions  = require('./config/cors');
const errorHandler = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const mathRoutes = require('./modules/math/math.routes');

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // ছবির আপলোডের জন্য সাইজ বাড়ানো হয়েছে
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/math', mathRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'পাঠবন্ধু Backend চলছে!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route পাওয়া যায়নি' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;