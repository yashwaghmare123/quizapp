import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubmitQuiz from "./Submitquiz";

const Takequiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertQuizIndex, setAlertQuizIndex] = useState(null);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    
    // Pre-made quizzes
    const preMadeQuizzes = [
      {
        title: "C Programming Fundamentals",
        timeLimit: 10,
        questions: [
          {
            question: "Which of the following is the correct way to declare a variable in C?",
            options: ["int x;", "variable int x;", "declare int x;", "x int;"],
            correctAnswer: 0
          },
          {
            question: "What is the output of printf('%d', 5/2) in C?",
            options: ["2.5", "2", "3", "Error"],
            correctAnswer: 1
          },
          {
            question: "Which header file is required for using printf() function?",
            options: ["<stdlib.h>", "<string.h>", "<stdio.h>", "<math.h>"],
            correctAnswer: 2
          },
          {
            question: "What does the '&' operator do in C?",
            options: ["Logical AND", "Bitwise AND", "Address of operator", "Both B and C"],
            correctAnswer: 3
          },
          {
            question: "Which of the following is NOT a valid C data type?",
            options: ["int", "float", "string", "char"],
            correctAnswer: 2
          }
        ]
      },
      {
        title: "Python Programming Basics",
        timeLimit: 10,
        questions: [
          {
            question: "Which of the following is used to define a function in Python?",
            options: ["function", "def", "define", "func"],
            correctAnswer: 1
          },
          {
            question: "What is the output of print(type([1, 2, 3]))?",
            options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"],
            correctAnswer: 0
          },
          {
            question: "Which operator is used for floor division in Python?",
            options: ["/", "//", "%", "**"],
            correctAnswer: 1
          },
          {
            question: "How do you create a comment in Python?",
            options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"],
            correctAnswer: 2
          },
          {
            question: "What is the correct way to create a list in Python?",
            options: ["list = (1, 2, 3)", "list = [1, 2, 3]", "list = {1, 2, 3}", "list = <1, 2, 3>"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "Java Programming Essentials",
        timeLimit: 10,
        questions: [
          {
            question: "Which of the following is the correct way to create an object in Java?",
            options: ["MyClass obj = new MyClass();", "MyClass obj = MyClass();", "new MyClass obj;", "create MyClass obj;"],
            correctAnswer: 0
          },
          {
            question: "What is the main method signature in Java?",
            options: ["public static void main(String args)", "public static void main(String[] args)", "static public void main(String[] args)", "Both B and C"],
            correctAnswer: 3
          },
          {
            question: "Which keyword is used for inheritance in Java?",
            options: ["inherits", "extends", "implements", "super"],
            correctAnswer: 1
          },
          {
            question: "What is the size of int data type in Java?",
            options: ["16 bits", "32 bits", "64 bits", "Depends on platform"],
            correctAnswer: 1
          },
          {
            question: "Which of the following is NOT an access modifier in Java?",
            options: ["public", "private", "protected", "package"],
            correctAnswer: 3
          }
        ]
      },
      {
        title: "React.js Fundamentals",
        timeLimit: 10,
        questions: [
          {
            question: "What is JSX in React?",
            options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
            correctAnswer: 0
          },
          {
            question: "Which method is used to render a React component?",
            options: ["render()", "display()", "show()", "mount()"],
            correctAnswer: 0
          },
          {
            question: "What is the correct way to pass props to a component?",
            options: ["<Component props={value}>", "<Component value={props}>", "<Component prop=value>", "<Component prop={value}>"],
            correctAnswer: 3
          },
          {
            question: "Which hook is used for managing state in functional components?",
            options: ["useEffect", "useState", "useContext", "useReducer"],
            correctAnswer: 1
          },
          {
            question: "What is the virtual DOM in React?",
            options: ["Real DOM copy", "JavaScript representation of DOM", "CSS representation", "HTML template"],
            correctAnswer: 1
          }
        ]
      },
      {
        title: "HTML & Web Development",
        timeLimit: 10,
        questions: [
          {
            question: "Which HTML tag is used to create a hyperlink?",
            options: ["<link>", "<href>", "<a>", "<url>"],
            correctAnswer: 2
          },
          {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
            correctAnswer: 0
          },
          {
            question: "Which attribute is used to specify the URL of a link?",
            options: ["src", "href", "link", "url"],
            correctAnswer: 1
          },
          {
            question: "Which HTML tag is used to display an image?",
            options: ["<image>", "<img>", "<pic>", "<src>"],
            correctAnswer: 1
          },
          {
            question: "What is the correct HTML tag for the largest heading?",
            options: ["<h6>", "<heading>", "<h1>", "<head>"],
            correctAnswer: 2
          }
        ]
      }
    ];
    
    // Combine saved quizzes with pre-made quizzes
    const allQuizzes = [...preMadeQuizzes, ...savedQuizzes];
    setQuizzes(allQuizzes);
  }, []);

  // Timer
  useEffect(() => {
    let timer;
    if (isQuizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitQuiz();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isQuizStarted, timeLeft]);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setTimeLeft(quiz.timeLimit * 60);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setCurrentQuestion(0);
    setIsQuizStarted(true);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setShowResult(true);
    setIsQuizStarted(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleDeleteQuiz = (index) => {
    setAlertQuizIndex(index);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (alertQuizIndex !== null) {
      // Only delete custom quizzes (saved ones), not pre-made ones
      if (alertQuizIndex >= 5) { // Pre-made quizzes are first 5
        const customQuizIndex = alertQuizIndex - 5;
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        savedQuizzes.splice(customQuizIndex, 1);
        localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
        
        // Update quizzes state
        const updatedQuizzes = [...quizzes];
        updatedQuizzes.splice(alertQuizIndex, 1);
        setQuizzes(updatedQuizzes);
      }
    }
    setShowAlert(false);
    setAlertQuizIndex(null);
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setAlertQuizIndex(null);
  };

  if (showResult) {
    return <SubmitQuiz selectedQuiz={selectedQuiz} answers={answers} />;
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen  py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-blue-900">
              Available Quizzes
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Choose a quiz to test your knowledge
            </p>
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No quizzes available
              </h3>
              <p className="text-gray-600">Create a quiz first to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 relative"
                >
                  {index >= 5 && (
                    <button
                      onClick={() => handleDeleteQuiz(index)}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 line-clamp-2">
                      {quiz.title}
                    </h3>

                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                      <p>⏱ {quiz.timeLimit} minutes</p>
                      <p>❓ {quiz.questions.length} questions</p>
                    </div>

                    <button
                      onClick={() => startQuiz(quiz)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition"
                    >
                      Start Quiz
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Alert */}
        {showAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Quiz
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this quiz? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {selectedQuiz.title}
            </h1>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} /{" "}
                {selectedQuiz.questions.length}
              </span>
              <div className="flex items-center text-red-600 font-semibold">
                ⏱ {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 h-2">
            <motion.div
              className="bg-blue-600 h-2"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Question */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedQuiz.questions[currentQuestion].question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {selectedQuiz.questions[currentQuestion].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-4 rounded-lg text-left border flex items-center transition-all ${
                          answers[currentQuestion] === index
                            ? "border-blue-500 bg-blue-50 text-blue-900 shadow"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-full mr-3 text-sm font-medium ${
                            answers[currentQuestion] === index
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
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

              {currentQuestion === selectedQuiz.questions.length - 1 ? (
                <button
                  onClick={submitQuiz}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Takequiz;