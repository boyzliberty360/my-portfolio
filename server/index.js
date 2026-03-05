import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting configuration
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute per IP

// Rate limiter middleware
const rateLimiter = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Get or initialize rate limit data for this IP
  let rateData = rateLimitStore.get(clientIP);
  
  if (!rateData || now - rateData.windowStart > RATE_LIMIT_WINDOW) {
    // Start new window
    rateData = {
      windowStart: now,
      requestCount: 1
    };
    rateLimitStore.set(clientIP, rateData);
    next();
    return;
  }
  
  // Check if limit exceeded
  if (rateData.requestCount >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - rateData.windowStart)) / 1000);
    res.status(429).json({
      success: false,
      message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      retryAfter
    });
    return;
  }
  
  // Increment request count
  rateData.requestCount++;
  rateLimitStore.set(clientIP, rateData);
  next();
};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW * 2) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// In-memory storage for submissions (replace with database in production)
const submissions = [];

app.use(cors());
app.use(express.json());

// Apply rate limiting to all API routes
app.use('/api', rateLimiter);

// Store contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, and message are required' 
    });
  }

  // Create submission object
  const submission = {
    id: Date.now(),
    name,
    email,
    subject: subject || 'No Subject',
    message,
    submittedAt: new Date().toISOString(),
    status: 'new'
  };

  // Store submission
  submissions.push(submission);

  // Log to console (for debugging)
  console.log('=== New Contact Form Submission ===');
  console.log(submission);
  console.log('===================================');

  // Return success response
  res.json({ 
    success: true, 
    message: 'Message received successfully',
    submissionId: submission.id
  });
});

// Get all submissions (for your backend to fetch)
app.get('/api/submissions', (req, res) => {
  res.json({ success: true, submissions });
});

// Mark submission as read
app.patch('/api/submissions/:id', (req, res) => {
  const { id } = req.params;
  const index = submissions.findIndex(s => s.id === parseInt(id));
  
  if (index !== -1) {
    submissions[index].status = 'read';
    return res.json({ success: true, submission: submissions[index] });
  }
  
  res.status(404).json({ success: false, message: 'Submission not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Contact form endpoint: POST http://localhost:${PORT}/api/contact`);
});
