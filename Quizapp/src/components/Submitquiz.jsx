import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitQuiz = ({ selectedQuiz, answers }) => {
  const navigate = useNavigate();

  // Calculate score
  const score = answers.reduce((total, answer, index) => {
    if (answer === selectedQuiz.questions[index].correctAnswer) {
      return total + 1;
    }
    return total;
  }, 0);

  // Store result in localStorage
  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    results.push({
      quizTitle: selectedQuiz.title,
      score,
      totalQuestions: selectedQuiz.questions.length,
      date: new Date().toISOString(),
    });
    localStorage.setItem('quizResults', JSON.stringify(results));
  }, []);

  const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
  const getGrade = () => {
    if (percentage >= 90) return ['A+', 'Outstanding!', 'text-green-600'];
    if (percentage >= 80) return ['A', 'Excellent work!', 'text-green-600'];
    if (percentage >= 70) return ['B', 'Good job!', 'text-blue-600'];
    if (percentage >= 60) return ['C', 'Keep practicing!', 'text-yellow-600'];
    if (percentage >= 50) return ['D', 'Need improvement', 'text-red-600'];
    if(percentage<35) return['F','Failed','text-red-600'];
  };

  const [grade, message, colorClass] = getGrade();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colorClass}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-blue-100">Here's how you performed</p>
          </div>

          {/* Score Section */}
          <div className="p-6">
            <div className="mb-8 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{score}/{selectedQuiz.questions.length}</div>
              <div className={`text-2xl font-semibold mb-1 ${colorClass}`}>{grade}</div>
              <div className="text-sm text-gray-600">{message}</div>
              <div className="mt-2 text-gray-700">Percentage: {percentage}%</div>
            </div>

            {/* Question Feedback Section */}
            <div className="space-y-4">
              {selectedQuiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div key={index} className="p-4 border rounded-md bg-gray-50">
                    <p className="font-medium">Q{index + 1}: {question.question}</p>
                    <p className={`mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600">
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Back to Home
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                Try Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitQuiz;
