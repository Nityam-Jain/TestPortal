import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit2, Trash2 } from 'lucide-react';
import QuestionFormModal from "./QuestionFormModal";

export default function QuestionManager() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vendorToken = sessionStorage.getItem("venderToken");

  // Fetch hierarchy
  const fetchHierarchy = async () => {
    try {
      const res = await axios.get("/api/courses/hierarchy", {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // Fetch questions for selected category
  const fetchQuestions = async (categoryId) => {
    try {
      const res = await axios.get(`/api/questions/${categoryId}`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      setQuestions(res.data.questions || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, []);

  // ---------------------------
  // CRUD Handlers
  // ---------------------------
  const handleSave = async (questionsArray) => {
    if (!selectedCourse || !selectedSubject || !selectedCategory) {
      return Swal.fire(
        "Error",
        "Select course, subject, and category first",
        "error"
      );
    }

    try {
      // CASE 1: Update a single question
      if (editingQuestion) {
        await axios.put(
          `/api/questions/${editingQuestion._id}`,
          { ...questionsArray[0] }, // only 1 question in edit mode
          { headers: { Authorization: `Bearer ${vendorToken}` } }
        );
        Swal.fire("Updated", "Question updated successfully", "success");
      }
      // CASE 2: Create multiple questions
      else {
        const formatted = questionsArray.map((q) => ({
          ...q,
          courseId: selectedCourse._id,
          subjectId: selectedSubject._id,
          categoryId: selectedCategory._id,
        }));

        await axios.post("/api/questions", formatted, {
          headers: { Authorization: `Bearer ${vendorToken}` },
        });
        Swal.fire("Success", "Questions added successfully", "success");
      }

      setEditingQuestion(null);
      fetchQuestions(selectedCategory._id);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const handleEdit = (q) => {
    // pass single-question into modal
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      Swal.fire("Deleted", "Question removed", "success");
      fetchQuestions(selectedCategory._id);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4 pt-5 md:pt-0 sm:pt-5">
        Question Manager
      </h2>

      {/* STEP 1: Courses */}
      {!selectedCourse && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition"
              onClick={() => setSelectedCourse(course)}
            >
              <h3 className="font-bold text-lg">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: Subjects */}
      {selectedCourse && !selectedSubject && (
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back to Courses
          </button>

          <h3 className="text-xl font-semibold mb-3">
            Subjects in {selectedCourse.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedCourse.subjects?.map((s) => (
              <div
                key={s._id}
                className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition"
                onClick={() => setSelectedSubject(s)}
              >
                <h4 className="font-semibold">{s.name}</h4>
                <p className="text-sm text-gray-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Categories */}
      {selectedSubject && !selectedCategory && (
        <div>
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-4 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back to Subjects
          </button>

          <h3 className="text-xl font-semibold mb-3">
            Categories in {selectedSubject.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedSubject.categories?.map((cat) => (
              <div
                key={cat._id}
                className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl transition"
                onClick={() => {
                  setSelectedCategory(cat);
                  fetchQuestions(cat._id);
                }}
              >
                <h4 className="font-semibold">{cat.name}</h4>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Questions */}
      {selectedCategory && (
        <div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back to Categories
          </button>

          <h3 className="text-xl font-semibold mb-3">
            Questions in {selectedCategory.name}
          </h3>

          {/* Add Button */}
          <button
            onClick={() => {
              setEditingQuestion(null);
              setIsModalOpen(true);
            }}
            className="fixed right-6 top-20 sm:top-16 md:top-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
          >
            + Add
          </button>

          {/* Modal */}
          <QuestionFormModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            editingQuestion={editingQuestion}
          />

          {/* Questions as cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((q, i) => (
              <div
                key={q._id}
                className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold mb-2">
                    {i + 1}. {q.questionText}
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={
                          opt === q.correctAnswer
                            ? "font-bold text-green-600"
                            : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-2 text-blue-500 hover:text-blue-700 rounded transition-p-3 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-100/80 flex items-center justify-center transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="p-3 text-red-600 hover:text-red-700 rounded-md hover:bg-red-100/80 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={20} /> 
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
