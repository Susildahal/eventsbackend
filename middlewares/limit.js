import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  limit: 1000, 
  standardHeaders: 'draft-8',
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests, please try again after 1 minute"
    });
  },
});

export default limiter;
