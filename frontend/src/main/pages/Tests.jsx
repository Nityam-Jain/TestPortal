"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Flag,
  Trophy,
  X,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Tests = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [marked, setMarked] = useState([]);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [timeLeft, setTimeLeft] = useState("10:00");
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  // ✅ Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${sessionStorage.getItem("venderToken")}`;
        const res = await axios.get("/api/questions");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  // ✅ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const [mins, secs] = timeLeft.split(":").map(Number);
      if (mins === 0 && secs === 0) {
        clearInterval(interval);
        onFinish();
      } else {
        const totalSecs = mins * 60 + secs - 1;
        const m = Math.floor(totalSecs / 60);
        const s = totalSecs % 60;
        setTimeLeft(
          `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const getTimeColor = () => {
    const [mins] = timeLeft.split(":").map(Number);
    if (mins <= 1) return "text-red-500";
    if (mins <= 3) return "text-yellow-500";
    return "text-green-600";
  };

  const handleOptionChange = (questionId, selected) => {
    const correct = questions.find((q) => q._id === questionId)?.correctAnswer;
    setAnswers({ ...answers, [questionId]: selected });
    setResponses((prev) => ({
      ...prev,
      [questionId]: [selected, correct],
    }));
  };

  const onMark = () => {
    const id = questions[current]?._id;
    if (id && !marked.includes(id)) {
      setMarked((prev) => [...prev, id]);
    }
  };

  const navigateNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const navigatePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const onFinish = () => {
    let correct = 0;
    Object.values(responses).forEach(([selected, correctOpt]) => {
      if (selected === correctOpt) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    setShowConfirmFinish(false);
  };

  const currentQ = questions[current];

  return (
    <div className="min-h-screen bg-[#F9F3EF]">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Home
            className="cursor-pointer text-[#1B3C53]"
            onClick={() => navigate("/")}
          />
          <h1 className="text-lg font-semibold text-[#1B3C53]">Test Portal</h1>
        </div>
        <div className={`flex items-center gap-2 font-medium ${getTimeColor()}`}>
          <Clock className="w-5 h-5" />
          {timeLeft}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* One Question View */}
        {!submitted && questions.length > 0 && currentQ && (
          <>
            <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#1B3C53]">
                  Question {current + 1} of {questions.length}
                </h2>
                <div className="flex gap-3">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    onClick={onMark}
                  >
                    <Flag className="w-4 h-4" />
                    Mark
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    onClick={() => setShowConfirmFinish(true)}
                  >
                    <Trophy className="w-4 h-4" />
                    Finish
                  </button>
                </div>
              </div>

              <p className="text-lg text-[#1B3C53] font-medium">
                {currentQ?.questionText}
              </p>

              <div className="grid gap-3">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentQ._id] === opt;
                  const isCorrect = currentQ.correctAnswer === opt;
                  const isIncorrect = submitted && isSelected && !isCorrect;

                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer
                        ${
                          isSelected
                            ? isCorrect
                              ? "bg-green-100 border-green-500"
                              : "bg-red-100 border-red-500"
                            : "hover:bg-gray-100 border-gray-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ._id}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() =>
                          handleOptionChange(currentQ._id, opt)
                        }
                        disabled={submitted}
                      />
                      <span className="text-gray-800">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md disabled:opacity-50"
                onClick={navigatePrev}
                disabled={current === 0}
              >
                <ArrowLeft className="w-4 h-4 inline-block mr-1" />
                Prev
              </button>
              <button
                className="bg-[#1B3C53] text-white px-4 py-2 rounded-md"
                onClick={navigateNext}
                disabled={current === questions.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 inline-block ml-1" />
              </button>
            </div>

            {/* Question Palette */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-6">
              {questions.map((q, idx) => (
                <button
                  key={q._id}
                  onClick={() => setCurrent(idx)}
                  className={`w-10 h-10 rounded-full font-medium border ${
                    responses[q._id]
                      ? "bg-green-100 border-green-500"
                      : marked.includes(q._id)
                      ? "bg-yellow-100 border-yellow-500"
                      : "bg-white border-gray-300"
                  } ${current === idx ? "ring-2 ring-[#1B3C53]" : ""}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Result View */}
        {submitted && (
          <div className="text-center p-10 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-[#1B3C53]">
              Test Submitted!
            </h2>
            <p className="text-lg text-gray-700">
              Your Score:{" "}
              <span className="font-bold text-[#1B3C53]">{score}</span> /{" "}
              {questions.length}
            </p>
            <button
              className="mt-4 bg-[#1B3C53] text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4 text-center relative">
            <X
              className="absolute top-3 right-3 w-5 h-5 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmFinish(false)}
            />
            <Trophy className="w-12 h-12 text-[#1B3C53] mx-auto" />
            <h3 className="text-lg font-semibold text-[#1B3C53]">
              Submit Test?
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to submit the test? You won’t be able to
              change your answers.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setShowConfirmFinish(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#1B3C53] text-white px-4 py-2 rounded-md"
                onClick={onFinish}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;
