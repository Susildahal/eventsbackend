import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userrouter from './routes/auth.js';
import eventrouter from './routes/events.js';
import servicerouter from './routes/service.js';
import settingsRouter from './routes/siteSetting.js';
import contractrouter from './routes/constactus.js';
import faqrouter from './routes/faq.js';
import galleryRouter from './routes/gallery.js';
import booknowRouter from './routes/booknow.js';
import eventTypesRouter from './routes/eventstypes.js';
import serviceTypesRouter from './routes/servicetypes.js';
import servicedashbordRouter from './routes/servicedashbord.js';
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;
console.log("PORT:", process.env.PORT);
const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200     
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

// Serve uploads directory as static
app.use('/api/uploads', express.static('uploads'));

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userrouter);
app.use('/api/events', eventrouter);
app.use('/api/services', servicerouter);
app.use('/api/settings', settingsRouter);
app.use('/api/contactus', contractrouter);
app.use('/api/faqs', faqrouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/bookings', booknowRouter);
app.use('/api/eventtypes', eventTypesRouter);
app.use('/api/servicetypes', serviceTypesRouter);
app.use('/api/servicedashboard', servicedashbordRouter);
// Connect to MongoDB
connectDB();

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  if (res.headersSent) return next(err);
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({ path: e.path, message: e.message }));
    return res.status(400).json({ message: 'Validation error', errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid value', path: err.path, value: err.value });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
// Start the server
app.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
}
);