import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function PublicTests() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch hierarchy like QuestionManager
  const fetchHierarchy = async () => {
    try {
      const res = await axios.get("/api/courses/hierarchy");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching hierarchy:", err);
    }
  };

  // 🔹 Fetch tests for selected category
 const fetchTests = async (categoryId) => {
  try {
    const res = await axios.get(`/api/tests/public?categoryId=${categoryId}`);
    setTests(res.data || []);
  } catch (err) {
    console.error("Error fetching tests:", err);
  }
};


  // 🔹 Fetch single test with questions
  const handleViewTest = async (testId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/tests/${testId}`);
      setSelectedTest(res.data);
    } catch (err) {
      console.error("Error fetching test:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHierarchy();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* STEP 1: Courses */}
      <h1 className="text-3xl font-bold mb-6">📘 Listed Tests</h1>
      {!selectedCourse && !selectedTest && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl"
                onClick={() => setSelectedCourse(course)}
              >
                <h1>Explore test</h1>
                <h3 className="font-bold text-lg">{course.name}</h3>
                
                 <p className="text-sm text-gray-500">{course.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Subjects */}
      {selectedCourse && !selectedSubject && !selectedTest && (
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back to Courses
          </button>
          <h2 className="text-2xl font-bold mb-4">
            📖 Subjects in {selectedCourse.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedCourse.subjects?.map((subject) => (
              <motion.div
                key={subject._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl"
                onClick={() => setSelectedSubject(subject)}
              >
                <h4 className="font-semibold">{subject.name}</h4>
                <p className="text-sm text-gray-500">{subject.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Categories */}
      {selectedSubject && !selectedCategory && !selectedTest && (
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-4 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back to Subjects
          </button>
          <h2 className="text-2xl font-bold mb-4">
            🏷 Categories in {selectedSubject.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedSubject.categories?.map((cat) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-xl"
                onClick={() => {
                  setSelectedCategory(cat);
                  fetchTests(cat._id);
                }}
              >
                <h4 className="font-semibold">{cat.name}</h4>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Tests */}
      {selectedCategory && !selectedTest && (
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back to Categories
          </button>
          <h2 className="text-2xl font-bold mb-4">
            🎯 Tests in {selectedCategory.name}
          </h2>

          {tests.length === 0 ? (
            <p className="text-gray-500">No tests available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, index) => (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white shadow-md rounded-2xl p-5 hover:shadow-xl"
                >
                  <h2 className="text-xl font-semibold">{test.title}</h2>
                  <p className="text-gray-600 text-sm">{test.description}</p>
                  <div className="mt-4 text-sm">
                    ⏳ {test.duration} mins | 📊 {test.difficulty}
                  </div>
                  <button
                    onClick={() => handleViewTest(test._id)}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
                  >
                    View Test
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 5: Single Test with Questions */}
      {selectedTest && (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedTest(null)}
            className="mb-6 px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back to Tests
          </button>

          {loading ? (
            <p>Loading test...</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h1 className="text-3xl font-bold mb-2">{selectedTest.title}</h1>
              <p className="text-gray-600 mb-4">{selectedTest.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <p className="bg-gray-50 p-3 rounded-lg">
                  ⏳ Duration: {selectedTest.duration} mins
                </p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  🏆 Total Marks: {selectedTest.totalMarks}
                </p>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition mb-8">
                🚀 Start Test
              </button>

              <h2 className="text-xl font-bold mb-3">📖 Questions Preview</h2>
              <ul className="space-y-4">
                {selectedTest.questions.map((q, idx) => (
                  <li key={q._id} className="border rounded-xl p-4 bg-gray-50">
                    <p className="font-medium">
                      {idx + 1}. {q.questionText}
                    </p>
                    <ul className="mt-2 grid grid-cols-2 gap-2">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className="text-sm bg-white shadow-sm border rounded-lg px-3 py-1"
                        >
                          <span className="mr-2 font-bold">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
