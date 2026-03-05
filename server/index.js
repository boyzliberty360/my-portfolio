import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

// In-memory storage for submissions (replace with database in production)
const submissions = [];

app.use(cors());
app.use(express.json());

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
