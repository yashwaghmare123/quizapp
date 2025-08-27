import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-blue-600">QuizMaster</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create and take quizzes with our interactive platform. Test your knowledge or challenge others!
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            <div className="relative group">
              <div className="relative bg-white rounded-lg shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className="px-6 py-8">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Quiz</h3>
                  <p className="text-gray-500 mb-6">Design your own quiz with custom questions, multiple choice answers, and time limits.</p>
                  <Link
                    to="/create-quiz"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create New Quiz
                  </Link>
 <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Automated Quiz</h3>
                  <p className="text-gray-500 mb-6">Design your own quiz with custom questions, multiple choice answers, and time limits.</p>
                  <Link
                    to="/ai-quiz"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create New Automated
                  </Link>



                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="relative bg-white rounded-lg shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className="px-6 py-8">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Quiz</h3>
                  <p className="text-gray-500 mb-6">Challenge yourself with our collection of quizzes. Track your progress and improve your knowledge.</p>
                  <Link
                    to="/take-quiz"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                  >
                    Start Quiz
                  </Link>
                </div>
              </div>




              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
