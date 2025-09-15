import { useState, useEffect } from "react";

export default function QuestionFormModal({
  open,
  onClose,
  onSave,
  editingQuestion,
  resetForm,
}) {
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  // Reset or populate when modal opens/closes
  useEffect(() => {
    if (open) {
      if (editingQuestion) {
        // Ensure it's always an array
        setQuestions(
          Array.isArray(editingQuestion)
            ? editingQuestion
            : [editingQuestion]
        );
      } else {
        setQuestions([{ text: "", options: ["", "", "", ""], correctAnswer: "" }]);
      }
    }
  }, [open, editingQuestion]);

  if (!open) return null;

  const handleChangeQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleChangeOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 p-6 space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">
          {editingQuestion ? "Edit Questions" : "Add Questions"}
        </h2>

        <div className="space-y-6">
          {Array.isArray(questions) &&
            questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border p-4 rounded-lg bg-gray-50 space-y-4"
              >
                <h3 className="font-semibold">Question {qIndex + 1}</h3>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    placeholder="Enter question"
                    className="border p-2 w-full rounded"
                    value={q.text}
                    onChange={(e) =>
                      handleChangeQuestion(qIndex, "text", e.target.value)
                    }
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Options
                  </label>
                  {q.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      className="border p-2 w-full rounded mb-2"
                      value={opt}
                      onChange={(e) =>
                        handleChangeOption(qIndex, idx, e.target.value)
                      }
                    />
                  ))}
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    placeholder="Enter correct answer"
                    className="border p-2 w-full rounded"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleChangeQuestion(
                        qIndex,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}

          {/* Add More Questions Button */}
          <button
            type="button"
            onClick={addNewQuestion}
            className="w-full px-4 py-2 border border-dashed border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            + Add Another Question
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white pb-2">
          <button
            onClick={() => {
              resetForm?.();
              onClose();
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(questions);
              onClose();
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            {editingQuestion ? "Update All" : "Save All"}
          </button>
        </div>
      </div>
    </div>
  );
}
