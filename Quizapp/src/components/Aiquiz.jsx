import React, { useState, useEffect } from "react";
import axios from "axios";

// Circular Progress Component
const CircularProgress = ({ percentage, size = 160, strokeWidth = 8 }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Professional color scheme based on percentage
  const getColors = () => {
    if (percentage >= 90) return { stroke: '#10b981', bg: '#f0fdf4', text: '#065f46' }; // Emerald
    if (percentage >= 80) return { stroke: '#3b82f6', bg: '#eff6ff', text: '#1e40af' }; // Blue
    if (percentage >= 70) return { stroke: '#8b5cf6', bg: '#f5f3ff', text: '#5b21b6' }; // Violet
    if (percentage >= 60) return { stroke: '#f59e0b', bg: '#fffbeb', text: '#92400e' }; // Amber
    if (percentage >= 50) return { stroke: '#ef4444', bg: '#fef2f2', text: '#991b1b' }; // Red
    return { stroke: '#6b7280', bg: '#f9fafb', text: '#374151' }; // Gray
  };

  const colors = getColors();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-lg font-bold ${colors.text === '#065f46' ? 'text-emerald-700' : colors.text === '#1e40af' ? 'text-blue-700' : colors.text === '#5b21b6' ? 'text-violet-700' : colors.text === '#92400e' ? 'text-amber-700' : colors.text === '#991b1b' ? 'text-red-700' : 'text-gray-700'}`}>
            {Math.round(animatedPercentage)}%
          </div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>
    </div>
  );
};

const AIQuiz = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [timeInterval, setTimeInterval] = useState(60);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Generate quiz
  const generateQuiz = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first!");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/generate-quiz", {
        topic,
        numQuestions,
      });
      setQuiz(response.data);
      setAnswers(new Array(response.data?.questions?.length || 0).fill(null));
      setCurrentQuestion(0);
      setTimeLeft(timeInterval);
      setShowResult(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!quiz || showResult) return;
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [quiz, timeLeft, showResult]);

  const handleAnswer = (index) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
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
    const calculatedScore = answers.reduce((total, ans, idx) => {
      if (quiz.questions[idx].options[ans] === quiz.questions[idx].correctAnswer) {
        return total + 1;
      }
      return total;
    }, 0);
    setScore(calculatedScore);
    setShowResult(true);
  };

  // --- Initial Screen ---
  if (!quiz && !showResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Quiz Generator</h2>
            <p className="text-gray-600">Enter a topic and let AI create a personalized quiz for you</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., JavaScript, History, Biology"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <select
                value={timeInterval}
                onChange={(e) => setTimeInterval(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>

            <button
              onClick={generateQuiz}
              disabled={isLoading || !topic.trim()}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Quiz...
                </span>
              ) : (
                "Generate Quiz"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Result Screen ---
  if (showResult) {
    const percentage = quiz?.questions?.length ? Math.round((score / quiz.questions.length) * 100) : 0;
    
    const getGrade = () => {
      if (percentage >= 90) return {
        grade: 'A+',
        message: 'Outstanding Performance!',
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200'
      };
      if (percentage >= 80) return {
        grade: 'A',
        message: 'Excellent Work!',
        color: 'blue',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      };
      if (percentage >= 70) return {
        grade: 'B',
        message: 'Good Job!',
        color: 'violet',
        bgColor: 'bg-violet-50',
        textColor: 'text-violet-700',
        borderColor: 'border-violet-200'
      };
      if (percentage >= 60) return {
        grade: 'C',
        message: 'Keep Practicing!',
        color: 'amber',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-200'
      };
      if (percentage >= 50) return {
        grade: 'D',
        message: 'Need Improvement',
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
      };
      return {
        grade: 'F',
        message: 'Failed - Try Again',
        color: 'gray',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      };
    };

    const gradeInfo = getGrade();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Full Width Header */}
        <div className="px-6 py-10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3">
              Quiz Completed! 
            </h2>
            <p className="text-lg bg-gradient-to-r from-pink-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-semibold">{topic}</p>
          </div>
        </div>

        {/* Full Width Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left: Score Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className="text-center mb-6">
                  <CircularProgress percentage={percentage} size={120} strokeWidth={10} />
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800 mb-1">
                      {score}<span className="text-xl text-slate-500">/{quiz?.questions?.length || 0}</span>
                    </div>
                    <div className="text-sm text-slate-600 font-medium">Questions Correct</div>
                  </div>
                  
                  <div className={`text-center px-4 py-3 rounded-xl ${gradeInfo.bgColor} ${gradeInfo.borderColor} border-2`}>
                    <div className={`text-2xl font-bold ${gradeInfo.textColor} mb-1`}>{gradeInfo.grade}</div>
                    <div className={`text-sm font-medium ${gradeInfo.textColor}`}>{gradeInfo.message}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-slate-700">{percentage}%</div>
                      <div className="text-xs text-slate-500 font-medium">Accuracy</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-emerald-600">{score}</div>
                        <div className="text-xs text-slate-500 font-medium">Correct</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-red-500">{(quiz?.questions?.length || 0) - score}</div>
                        <div className="text-xs text-slate-500 font-medium">Wrong</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Question Review */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Question Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quiz.questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer !== null && question.options[userAnswer] === question.correctAnswer;
                    return (
                      <div key={index} className={`p-4 rounded-xl border-2 ${
                        isCorrect 
                          ? 'bg-emerald-50 border-emerald-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCorrect 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 mb-3 text-sm leading-tight">{question.question}</p>
                            
                            <div className="space-y-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-slate-600">Your answer:</span>
                                <span className={`inline-block px-3 py-1 rounded-lg font-medium text-sm ${
                                  isCorrect 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {userAnswer !== null ? question.options[userAnswer] : 'No answer'}
                                </span>
                              </div>
                              
                              {!isCorrect && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-medium text-slate-600">Correct answer:</span>
                                  <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-medium text-sm">
                                    {question.correctAnswer}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => {
                setQuiz(null);
                setAnswers([]);
                setTopic("");
                setShowResult(false);
              }}
              className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Create New Quiz
            </button>

            <button
              onClick={() => window.print()}
              className="px-8 py-3 border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50 font-semibold rounded-xl transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H9.5a2 2 0 01-2-2V5a2 2 0 012-2H14" />
              </svg>
              Save Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Quiz Screen ---
  const question = quiz.questions?.[currentQuestion];
  if (!question) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading question...</p>
      </div>
    </div>
  );

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">{quiz.title || topic}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {quiz.questions?.length || 0}
                </span>
                <div className="flex items-center text-red-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{timeLeft}s</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 border rounded-lg transition-colors ${
                  answers[currentQuestion] === idx
                    ? "border-purple-500 bg-purple-50 text-purple-900"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full mr-3 text-sm font-medium">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentQuestion === 0
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {currentQuestion === (quiz.questions?.length || 0) - 1 ? (
              <button
                onClick={submitQuiz}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIQuiz;
