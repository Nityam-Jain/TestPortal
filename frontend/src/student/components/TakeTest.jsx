import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function TakeTest() {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const token = sessionStorage.getItem("userToken");

  useEffect(() => {
    const fetchQuestions = async (categoryId) => {
      try {
        const res = await axios.get(`/api/questions/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions || []);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch questions", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId, token]);

  const handleAnswer = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    Swal.fire("Test Completed!", "Your answers have been submitted.", "success");
    // Optionally: send answers to backend API
  };

  if (loading) return <p className="p-6 text-center">Loading questions...</p>;
  if (!questions.length) return <p className="p-6 text-center">No questions available.</p>;

  const q = questions[currentQ];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Question {currentQ + 1} of {questions.length}
      </h2>
      <p className="mb-4 text-gray-700">{q.questionText}</p>

      {q.options?.map((opt, idx) => (
        <div key={idx} className="mb-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={q._id}
              value={opt}
              checked={answers[q._id] === opt}
              onChange={() => handleAnswer(q._id, opt)}
              className="accent-blue-500"
            />
            {opt}
          </label>
        </div>
      ))}

      <button
        onClick={handleNext}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {currentQ === questions.length - 1 ? "Submit Test" : "Next Question"}
      </button>
    </div>
  );
}
 