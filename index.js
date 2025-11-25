import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userrouter from './routes/auth.js';
import eventrouter from './routes/events.js';
import servicerouter from './routes/service.js';
import settingsRouter from './routes/siteSetting.js';
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
app.use('/uploads', express.static('uploads'));

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/users', userrouter);
app.use('/api/events', eventrouter);
app.use('/api/services', servicerouter);
app.use('/api/settings', settingsRouter);
// Connect to MongoDB
connectDB();
// Start the server
app.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
}
);