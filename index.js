const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

// Email configuration with validation
let transporter = null;
let emailConfigured = false;

// Only create transporter if email credentials are properly set
if (process.env.EMAIL_USER && process.env.EMAIL_PASS && 
    process.env.EMAIL_USER !== 'your_gmail@gmail.com' && 
    process.env.EMAIL_PASS !== 'your_app_password') {
  
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    emailConfigured = true;
    console.log('Email service configured successfully');
  } catch (error) {
    console.log('Email configuration failed:', error.message);
  }
} else {
  console.log('Email not configured - using placeholder credentials');
}

// Send quiz results via email
app.post("/api/send-results", async (req, res) => {
  const { quizTitle, score, totalQuestions, percentage, questions, answers, studentName, studentEmail } = req.body;

  // Check if email is configured
  if (!emailConfigured || !transporter) {
    console.log('Email functionality not available - saving results locally instead');
    
    // For now, just return a success message with instructions
    return res.json({ 
      message: "Email not configured. To enable email functionality:\n\n1. Set up a Gmail account\n2. Generate an App Password\n3. Update .env file with:\n   - EMAIL_USER=your_email@gmail.com\n   - EMAIL_PASS=your_app_password\n\nResults saved locally instead.",
      resultsData: {
        quizTitle,
        studentName,
        studentEmail,
        score,
        totalQuestions,
        percentage,
        timestamp: new Date().toISOString()
      }
    });
  }

  try {
    // Create HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; text-align: center;">Quiz Results</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155;">Student Information</h3>
          <p><strong>Name:</strong> ${studentName || 'Anonymous'}</p>
          <p><strong>Email:</strong> ${studentEmail || 'Not provided'}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af;">Quiz: ${quizTitle}</h3>
          <p><strong>Score:</strong> ${score} out of ${totalQuestions} (${percentage}%)</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #334155;">Detailed Results</h3>
          ${questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer !== null && (
              typeof question.correctAnswer === 'string' 
                ? question.options[userAnswer] === question.correctAnswer
                : userAnswer === question.correctAnswer
            );
            
            return `
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 10px 0; ${isCorrect ? 'background-color: #f0fdf4;' : 'background-color: #fef2f2;'}">
                <h4 style="color: #334155; margin-bottom: 10px;">Question ${index + 1}</h4>
                <p style="margin-bottom: 10px;"><strong>${question.question}</strong></p>
                
                <p style="margin: 5px 0;"><strong>Your Answer:</strong> 
                  <span style="color: ${isCorrect ? '#059669' : '#dc2626'};">
                    ${userAnswer !== null ? question.options[userAnswer] : 'No answer'}
                  </span>
                </p>
                
                ${!isCorrect ? `
                  <p style="margin: 5px 0;"><strong>Correct Answer:</strong> 
                    <span style="color: #059669;">
                      ${typeof question.correctAnswer === 'string' ? question.correctAnswer : question.options[question.correctAnswer]}
                    </span>
                  </p>
                ` : ''}
                
                ${question.explanation ? `
                  <div style="background-color: #f8fafc; padding: 10px; border-radius: 4px; margin-top: 10px;">
                    <strong>Explanation:</strong><br>
                    ${question.explanation}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
          <h3 style="color: ${percentage >= 80 ? '#059669' : percentage >= 60 ? '#d97706' : '#dc2626'};">
            ${percentage >= 80 ? 'Excellent Work!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
          </h3>
          <p style="color: #64748b;">Generated by AI Quiz App</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      cc: studentEmail ? [studentEmail] : [],
      subject: `Quiz Results: ${quizTitle} - ${studentName || 'Student'}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Results sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send results via email" });
  }
});

app.post("/api/generate-quiz", async (req, res) => {
  const { topic, numQuestions} = req.body;

  // Retry logic for API overload
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Generating quiz (attempt ${attempt}/${maxRetries})...`);
      
      const prompt = `
Create a quiz on the topic "${topic}" with exactly ${numQuestions} multiple-choice questions.

CRITICAL: Each question MUST include a detailed "explanation" field that provides:
1. Why the correct answer is right (with reasoning)
2. Why each incorrect option is wrong (specific reasons for each)
3. Additional educational context about the topic

Return ONLY valid JSON in this EXACT format:

{
  "title": "Quiz about ${topic}",
  "questions": [
    {
      "question": "Your question here?",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "option2",
      "explanation": "DETAILED Step by step explanation: Option 2 is correct because [specific reason with details]. Option 1 is wrong because [specific reason]. Option 3 is incorrect due to [specific reason]. Option 4 is false because [specific reason]. Additional context: [educational information about the concept]."
    }
  ]
}

MANDATORY Requirements:
- Each question must have exactly 4 options
- The "correctAnswer" must match one of the options exactly
- The "explanation" field is REQUIRED and must be comprehensive (minimum 3-4 sentences)
- Explain why EACH option is right or wrong
- Provide educational context
- Return ONLY the JSON object, no markdown formatting or extra text`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      // Remove Markdown-style ```json if present
      responseText = responseText.replace(/```json|```/g, "").trim();

      const quizData = JSON.parse(responseText);
      return res.json(quizData);
      
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      
      // If it's a 503 (service overloaded) and we have retries left, wait and try again
      if (err.status === 503 && attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // If all retries failed or it's a different error
      if (attempt === maxRetries) {
        console.error('All retry attempts failed');
        return res.status(500).json({ 
          error: "Failed to generate quiz. The AI service is currently overloaded. Please try again in a few minutes." 
        });
      }
    }
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
