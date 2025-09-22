import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-blue-200 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Quiz-X</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
           Play Quiz and know about your knowledge 
            <br />Challenge yourself
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-10 md:grid-cols-3"
        >
          {/* Create Quiz Card */}
          <motion.div variants={item}>
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Create Quiz</h3>
              <p className="text-gray-600 mb-6">Design your own quiz with custom questions, multiple choice answers, and time limits.</p>
              <Link
                to="/create-quiz"
                className="inline-block px-5 py-2.5 text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition"
              >
                Create New Quiz
              </Link>
            </div>
          </motion.div>

          {/* AI Quiz Card */}
          <motion.div variants={item}>
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">AI-Powered Quiz</h3>
              <p className="text-gray-600 mb-6">Let our AI generate smart quizzes based on your chosen topic. Experience adaptive learning.</p>
              <Link
                to="/ai-quiz"
                className="inline-block px-5 py-2.5 text-white font-medium bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition"
              >
                Generate AI Quiz
              </Link>
            </div>
          </motion.div>

          {/* Take Quiz Card */}
          <motion.div variants={item}>
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8 text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Take Quiz</h3>
              <p className="text-gray-600 mb-6">Challenge yourself with our collection of quizzes. Track your progress and improve your knowledge.</p>
              <Link
                to="/take-quiz"
                className="inline-block px-5 py-2.5 text-white font-medium bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow hover:from-green-700 hover:to-green-800 transition"
              >
                Start Quiz
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
