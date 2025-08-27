
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Aiquiz from'./components/Aiquiz'
import CreateQuiz from "./components/CreateQuiz";
import Takequiz from "./components/Takequiz";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/take-quiz" element={<Takequiz />} />
          <Route path='/ai-quiz'element={<Aiquiz/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;