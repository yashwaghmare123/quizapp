const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/generate-quiz", async (req, res) => {
  const { topic, numQuestions} = req.body;

  try {
    const prompt = `
Create a quiz on the topic "${topic}".
Include ${numQuestions}multiple-choice questions with 4 options each.
Return only a JSON object like this:

{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "option2"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Remove Markdown-style ```json if present
    responseText = responseText.replace(/```json|```/g, "").trim();

    const quizData = JSON.parse(responseText);
    res.json(quizData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
