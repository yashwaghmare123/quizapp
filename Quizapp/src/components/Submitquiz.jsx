import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const SubmitQuiz = ({ selectedQuiz, answers }) => {
  const navigate = useNavigate();

  const score = answers.reduce((total, answer, index) => {
    if (answer === selectedQuiz.questions[index].correctAnswer) {
      return total + 1;
    }
    return total;
  }, 0);

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
      <div className="bg-gradient-to-r px-6 py-10">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-3">
      Quiz Completed!
    </h2>
    <p className="text-lg text-gray-700">{selectedQuiz.title}</p>
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
                    {score}<span className="text-xl text-slate-500">/{selectedQuiz.questions.length}</span>
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
                      <div className="text-lg font-bold text-red-500">{selectedQuiz.questions.length - score}</div>
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
                {selectedQuiz.questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
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
                                  {question.options[question.correctAnswer]}
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
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 border-2 border-blue-500 text-blue-600 bg-white hover:bg-blue-50 font-semibold rounded-xl transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitQuiz;
