import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    timeLimit: 0,
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ],
  });

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
        },
      ],
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    if (field === 'option') {
      const [optionIndex, optionValue] = value;
      updatedQuestions[index].options[optionIndex] = optionValue;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    quizzes.push(quizData);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    navigate('/');
  };

  return (
    <div className="min-h-screen  bg-blue-200  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Create New Quiz</h1>
            <p className="mt-1 text-sm text-gray-600">Design your quiz with custom questions and answers</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizData.title}
                  onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-6">
              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Question {qIndex + 1}</h3>
                    {quizData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Enter your question"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Answer Options
                      </label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full font-medium text-sm">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleQuestionChange(qIndex, 'option', [oIndex, e.target.value])}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        {question.options.map((_, index) => (
                          <option key={index} value={index}>
                            Option {String.fromCharCode(65 + index)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Question
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
