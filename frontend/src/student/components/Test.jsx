import React, { useState, useEffect } from "react";
import axios from "axios";

const coursesList = ["Course 1", "Course 2", "Course 3"];
const subjectsList = ["Subject A", "Subject B", "Subject C"];

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Fetch questions whenever filters change
  useEffect(() => {
    axios
      .get("/api/questions/user", {
        params: { course: selectedCourse, subject: selectedSubject },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error(err));
  }, [selectedCourse, selectedSubject]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Available Tests</h1>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Course Filter */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Courses</option>
          {coursesList.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Subjects</option>
          {subjectsList.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="font-semibold">
                {idx + 1}. {q.questionText}
              </h2>
              <ul className="list-disc ml-5 mt-2">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No questions found.</p>
      )}
    </div>
  );
};

export default Test;
