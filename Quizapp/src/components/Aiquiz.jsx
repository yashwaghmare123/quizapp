import React, { useState, useEffect } from "react";
import axios from "axios";

const AIQuiz = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5); // default 5
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute timer

  // Generate quiz
  const generateQuiz = async () => {
    if (!topic) return alert("Enter a topic first!");
    try {
      const response = await axios.post("http://localhost:5000/api/generate-quiz", {
        topic,
        numQuestions,
      });
      setQuiz(response.data);
      setAnswers(new Array(response.data?.questions?.length || 0).fill(null));
      setCurrentQuestion(0);
      setTimeLeft(60); // reset timer
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz");
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!quiz) return;
    if (timeLeft <= 0) {
      submitQuiz(); // auto-submit
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [quiz, timeLeft]);

  const handleAnswer = (index) => {
    if (!quiz) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index; // store the selected option index
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (quiz && currentQuestion < (quiz.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const submitQuiz = () => {
    if (!quiz) return;

    const score = answers.reduce((total, ans, idx) => {
      const selectedOption = quiz.questions[idx].options[ans];
      if (selectedOption === quiz.questions[idx].correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);

    alert(`Time's up! You scored ${score} out of ${quiz.questions?.length || 0}`);

    // Reset
    setQuiz(null);
    setAnswers([]);
    setTopic("");
    setTimeLeft(60);
  };

  // --- Initial Screen (Topic + Question Input) ---
  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Enter Topic for AI Quiz</h2>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., JavaScript, History"
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            placeholder="Number of Questions"
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={generateQuiz}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions?.[currentQuestion];
  if (!question) return <div className="text-center mt-8">Loading question...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{quiz.title || topic}</h2>
          <span className="text-red-600 font-bold">⏱ {timeLeft}s</span>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Question {currentQuestion + 1} of {quiz.questions?.length || 0}
          </p>
          <p className="text-lg font-medium text-gray-800 mb-4">{question.question}</p>
          <div className="space-y-3">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left py-2 px-4 border rounded-md ${
                  answers[currentQuestion] === idx
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`py-2 px-4 rounded-md ${
              currentQuestion === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Previous
          </button>

          {currentQuestion === (quiz.questions?.length || 0) - 1 ? (
            <button
              onClick={submitQuiz}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIQuiz;
