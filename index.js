import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import  axios from 'axios';
import { configureCloudinary } from './config/cloudinary.js';
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
import aboutRouter from './routes/about.js';
import aboutrouter from './routes/aboutimage.js';
import portfolioRouter from './routes/Portfolio.js';
import previewRouter from './routes/preview.js';
import eventsDashboardRouter from './routes/eventsdashbord.js';
import limiter from './middlewares/limit.js';


dotenv.config();

// Initialize Express app
const app = express();
// Configure Cloudinary
configureCloudinary();
const port = process.env.PORT || 8000;
console.log("PORT:", process.env.PORT);
const corsOptions = {
  origin: ['http://localhost:3000', 'http://192.168.10.79:3000' ,'https://eventfrontend-ivory.vercel.app'],
  optionsSuccessStatus: 200     
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

// Serve uploads directory as static
app.use('/api/uploads', express.static('uploads'));
app.use(limiter);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Email configuration test endpoint
app.get('/api/test-email', async (req, res) => {
  try {
    console.log('=== Testing Email Configuration ===');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : '❌ MISSING');
    
    // Dynamic import of transporter
    const transporter = (await import('./config/nodemiler.js')).default;
    
    // Verify SMTP connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Events Team Test" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      subject: "✅ Test Email - " + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">✅ Email Configuration Test Successful!</h2>
            <p>Your email system is working correctly on Render!</p>
            <hr/>
            <p><strong>Configuration:</strong></p>
            <ul>
              <li>Host: ${process.env.SMTP_HOST}</li>
              <li>Port: ${process.env.SMTP_PORT}</li>
              <li>User: ${process.env.SMTP_USER}</li>
              <li>From: ${process.env.SMTP_EMAIL}</li>
            </ul>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Message ID:</strong> ${info.messageId}</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    res.status(200).json({
      success: true,
      message: 'Email sent successfully! Check your inbox.',
      messageId: info.messageId,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_EMAIL
      }
    });
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_EMAIL
      }
    });
  }
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
app.use('/api/about', aboutRouter);
app.use('/api/aboutimage', aboutrouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/preview', previewRouter);
app.use('/api/eventsdashboard', eventsDashboardRouter);
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
//ping api 
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
}
);
setInterval(async () => {
  console.log("Automatic task running...");

  try {
    const res = await axios.get("https://eventsbackend-drzr.onrender.com/api/ping");
    console.log("Ping success:", res.data);
  } catch (error) {
    console.log("Ping failed:", error.message);
  }
}, 15 * 60 * 1000); // Ping every 15 minutes

// Start the server
app.listen(port,"0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
}
);