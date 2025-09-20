import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";  


export default function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [test, setTest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // prevent multiple submits

  const timerRef = useRef(null);
  const token = sessionStorage.getItem("userToken");

  let userId = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    userId = decoded.id;  // 👈 use the "id" field from token
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

  // 🔹 Replace this with real logged-in student data
  const student = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchTestAndQuestions = async () => {
      try {
        const testRes = await axios.get(`/api/tests/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const testData = testRes.data;
        setTest(testData);

        const categoryId = testData.categoryId?._id;

        if (!categoryId) {
          Swal.fire("Error", "Test category not found", "error");
          setLoading(false);
          return;
        }

        setDuration(testData.duration || 0);
        setTimeLeft((testData.duration || 0) * 60);

        const questionsRes = await axios.get(
          `/api/questions/student/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQuestions(questionsRes.data.questions || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch test or questions", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTestAndQuestions();
  }, [testId, token]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 && duration > 0) {
      clearInterval(timerRef.current);
      setIsTimeUp(true);
      Swal.fire(
        "Time's Up",
        "Sorry, time’s up. Auto-submitting your test.",
        "info"
      );
      handleSubmit(); // auto-submit on timeout
    }
  }, [timeLeft, duration]);

  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAnswer = (qId, value) => {
    if (isTimeUp) return;
    setAnswers({ ...answers, [qId]: value });
  };

  const handleNext = () => {
    if (isTimeUp) return;

    const q = questions[currentQ];
    if (!answers[q._id]) {
      Swal.fire(
        "Warning",
        "Please select an answer before proceeding",
        "warning"
      );
      return;
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit();
    }
  };

  // 🔹 Submit test to backend
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);

    if (!test) {
      Swal.fire("Error", "Test data not loaded yet.", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId,
          answers: selectedOption,  // matches backend schema
        })
      );
      if (!userId) {
        Swal.fire("Error", "User session expired. Please login again.", "error");
        setIsSubmitting(false);
        navigate("/login");
        return;
      }
      const res = await axios.post(
        `http://localhost:5000/api/results/${testId}`, // use param directly
        {
          testId: testId,
          studentId: userId,
          answers: formattedAnswers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "Test submitted successfully!", "success");
      navigate(`/result/${res.data.result.testId}?studentId=${student?._id}`);
    } catch (err) {
      console.error("Error submitting test:", err);
      Swal.fire("Error", "Something went wrong while submitting.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading)
    return <p className="p-6 text-center text-lg">Loading questions...</p>;
  if (!questions.length)
    return <p className="p-6 text-center text-lg">No questions available.</p>;

  const q = questions[currentQ]; 

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Take the Test</h2>
          <div className="text-lg font-medium text-red-600">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>
        <div className="text-gray-700 mb-4">
          <span className="font-semibold">Duration:</span> {duration} minutes
        </div>

        <div className="p-5 bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            Question {currentQ + 1} of {questions.length}
          </h3>
          <p className="text-gray-800 mb-4">{q.questionText}</p>
          <div className="space-y-3">
            {q.options?.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-blue-100 transition duration-200 ${answers[q._id] === opt
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
                  } ${isTimeUp ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name={q._id}
                  value={opt}
                  checked={answers[q._id] === opt}
                  onChange={() => handleAnswer(q._id, opt)}
                  className="accent-blue-500"
                  disabled={isTimeUp}
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={isTimeUp || isSubmitting}
            className={`px-6 py-3 rounded transition duration-300 ${isTimeUp || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {currentQ === questions.length - 1 ? "Submit Test" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
