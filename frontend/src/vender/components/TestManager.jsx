import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit2, Eye, Trash2 } from "lucide-react";

function TestManager() {
  const [tests, setTests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    difficulty: "Medium",
    totalMarks: 0,
    isPublic: true,
  });

  const [questions, setQuestions] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const vendorToken = sessionStorage.getItem("venderToken");

  // Fetch tests
  const fetchTests = async () => {
    try {
      const res = await axios.get("/api/tests/getAllTests", {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });

      setTests(res.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch tests", "error");
    }
  };

  // Fetch hierarchy (courses → subjects → categories)
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

  useEffect(() => {
    fetchTests();
    fetchHierarchy();
  }, []);

  // Fetch questions by category
  const fetchQuestions = async (categoryId) => {
    try {
      const res = await axios.get(`/api/questions/${categoryId}`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      setQuestions(res.data.questions || []);
      setCurrentCategory(categoryId);
      setShowQuestionsModal(true);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch questions", "error");
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add / update test
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !selectedSubject || !selectedCategory) {
      return Swal.fire(
        "Error",
        "Select course, subject, and category",
        "error"
      );
    }

    try {
      if (editMode && editingTestId) {
        await axios.put(
          `/api/tests/${editingTestId}`,
          {
            ...formData,
            courseId: selectedCourse._id,
            subjectId: selectedSubject._id,
            categoryId: selectedCategory._id,
          },
          { headers: { Authorization: `Bearer ${vendorToken}` } }
        );
        Swal.fire("Success", "Test updated successfully!", "success");
      } else {
        await axios.post(
          "/api/tests",
          {
            ...formData,
            courseId: selectedCourse._id,
            subjectId: selectedSubject._id,
            categoryId: selectedCategory._id,
          },
          { headers: { Authorization: `Bearer ${vendorToken}` } }
        );
        Swal.fire("Success", "Test created successfully!", "success");
      }

      setShowModal(false);
      setEditMode(false);
      setEditingTestId(null);
      fetchTests();
    } catch (err) {
      Swal.fire("Error", "Failed to save test", "error");
    }
  };

  // Delete test
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This test will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/tests/deleteTest/${id}`, {
            headers: { Authorization: `Bearer ${vendorToken}` },
          });
          Swal.fire("Deleted!", "Test has been deleted.", "success");
          fetchTests();
        } catch (err) {
          Swal.fire("Error", "Failed to delete test", "error");
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Test Management</h2>
        <button
          onClick={() => {
            setFormData({
              title: "",
              description: "",
              duration: 30,
              difficulty: "Medium",
              totalMarks: 0,
              isPublic: true,
            });
            setSelectedCourse(null);
            setSelectedSubject(null);
            setSelectedCategory(null);
            setEditMode(false);
            setEditingTestId(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add Test
        </button>
      </div>

      {/* Tests List */}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div
            key={test._id}
            className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Title & Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {test.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {test.description}
              </p>

              {/* Details */}
              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Course:</span>{" "}
                  {test.courseId?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Subject:</span>{" "}
                  {test.subjectId?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {test.categoryId?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {test.duration} mins
                </p>
                <p>
                  <span className="font-semibold">Difficulty:</span>{" "}
                  {test.difficulty}
                </p>
                <p>
                  <span className="font-semibold">Marks:</span>{" "}
                  {test.totalMarks}
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-2 mt-4">
              {/* Edit Button */}
              <button
                onClick={() => {
                  setFormData({
                    title: test.title,
                    description: test.description,
                    duration: test.duration,
                    difficulty: test.difficulty,
                    totalMarks: test.totalMarks,
                    isPublic: test.isPublic,
                  });
                  setSelectedCourse(test.courseId);
                  setSelectedSubject(test.subjectId);
                  setSelectedCategory(test.categoryId);
                  setEditingTestId(test._id);
                  setEditMode(true);
                  setShowModal(true);
                }}
                className="p-3 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-100/80 flex items-center justify-center transition-colors"
                title="Edit"
              >
                <Edit2 size={20} />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(test._id)}
                className="p-3 text-red-600 hover:text-red-700 rounded-md hover:bg-red-100/80 flex items-center justify-center transition-colors"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>

              {/* Questions Button */}
              <button
                onClick={() => fetchQuestions(test.categoryId?._id)}
                className="p-3 text-gray-600 hover:text-gray-800 rounded-md hover:bg-blue-100/80 flex items-center justify-center transition-colors"
                title="Questions"
              >
                <Eye size={20} />
              </button>
            </div>


          </div>
        ))}
      </div>

      {/* Show Questions Modal */}
      {showQuestionsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">Questions</h2>
            {questions.length === 0 ? (
              <p className="text-gray-500">
                No questions found for this category.
              </p>
            ) : (
              <ul className="space-y-4">
                {questions.map((q, idx) => (
                  <li
                    key={q._id}
                    className="p-3 border rounded-lg bg-gray-50 shadow-sm"
                  >
                    <p className="font-medium">
                      {idx + 1}. {q.questionText}
                    </p>
                    <ul className="ml-4 list-disc text-sm text-gray-700">
                      {q.options?.map((opt, i) => (
                        <li
                          key={i}
                          className={
                            opt === q.correctAnswer
                              ? "font-semibold text-green-600"
                              : ""
                          }
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowQuestionsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Test Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg mx-4 sm:mx-auto flex flex-col max-h-[90vh]">
            {/* Modal Content (scrollable) */}
            <div className="p-6 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Create Test</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter test title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter test description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  ></textarea>
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Course
                  </label>
                  <select
                    className="w-full border p-2 rounded"
                    value={selectedCourse?._id || ""}
                    onChange={(e) =>
                      setSelectedCourse(
                        courses.find((c) => c._id === e.target.value) || null
                      )
                    }
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                {selectedCourse && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <select
                      className="w-full border p-2 rounded"
                      value={selectedSubject?._id || ""}
                      onChange={(e) =>
                        setSelectedSubject(
                          selectedCourse.subjects.find(
                            (s) => s._id === e.target.value
                          ) || null
                        )
                      }
                    >
                      <option value="">Select Subject</option>
                      {selectedCourse.subjects?.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Category */}
                {selectedSubject && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border p-2 rounded"
                      value={selectedCategory?._id || ""}
                      onChange={(e) =>
                        setSelectedCategory(
                          selectedSubject.categories.find(
                            (cat) => cat._id === e.target.value
                          ) || null
                        )
                      }
                    >
                      <option value="">Select Category</option>
                      {selectedSubject.categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="Enter duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                {/* Total Marks */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    placeholder="Enter total marks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Public Test */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                  />
                  <label className="text-sm font-medium">Public Test</label>
                </div>
              </form>
            </div>

            {/* Footer Buttons (always visible) */}
            <div className="flex justify-end gap-2 border-t p-4 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestManager;
