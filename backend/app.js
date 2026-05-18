const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const passport     = require('./config/passport');
const corsOptions  = require('./config/cors');
const errorHandler = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./modules/auth/auth.routes');
const mathRoutes = require('./modules/math/math.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/math', mathRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pathyabandhu backend Running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler 
app.use(errorHandler);

module.exports = app;