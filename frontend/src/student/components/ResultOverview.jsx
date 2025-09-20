import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultOverview = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      console.error("No token found. Redirecting to login...");
      navigate("/login");
      return;
    }

    let studentId = null;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      studentId = decoded.id; // token contains "id"
    } catch (err) {
      console.error("Error decoding token:", err);
    }

    if (!studentId) {
      console.error("No studentId found in token");
      return;
    }

    axios
      .get(`http://localhost:5000/api/results/${resultId}?studentId=${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResult(res.data.result)) 
      .catch((err) => console.error("Error fetching result:", err));
  }, [resultId, navigate]);

  if (!result) return <p className="text-center py-10">Loading...</p>;

  // ✅ Safely default answers to empty array if undefined
  const answers = result.answers || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Test Result Overview
        </h1>

        {/* Score Section */}
        <div className="flex justify-around mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{result.score}</p>
            <p className="text-gray-600">Score</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {result.correctCount || 0}
            </p>
            <p className="text-gray-600">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">
              {result.wrongCount || 0}
            </p>
            <p className="text-gray-600">Wrong</p>
          </div>
        </div>

        {/* Answers Review */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Answer Review</h2>
          {answers.length ? (
            answers.map((ans, i) => (
              <div
                key={i}
                className={`p-4 mb-3 rounded-lg border ${
                  ans.isCorrect
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                }`}
              >
                <p className="font-medium">
                  {i + 1}. {ans.questionText}
                </p>
                <p>Your Answer: {ans.answer}</p>
                {!ans.isCorrect && (
                  <p className="text-sm text-gray-600">
                    Correct Answer: {ans.correctAnswer}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No answers available.</p>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultOverview;
