import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit2Icon, Trash2, ArrowLeft, Layers } from "lucide-react";

export default function CourseHierarchyManager() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const token = sessionStorage.getItem("venderToken");

  // Fetch hierarchy
  const fetchHierarchy = async () => {
    try {
      const res = await axios.get("/api/courses/hierarchy", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, []);

  // ---------- CRUD ----------
  const handleAdd = async (type, parent = null) => {
    const { value: name } = await Swal.fire({
      title: `Add ${type}`,
      input: "text",
      inputLabel: `${type} Name`,
      showCancelButton: true,
    });
    if (!name) return;

    try {
      let url = "";
      let payload = { name };

      if (type === "Course") url = "/api/courses";
      if (type === "Subject") {
        url = "/api/subjects";
        payload.courseId = parent._id;
      }
      if (type === "Category") {
        url = "/api/categories";
        payload.subjectId = parent._id;
      }

      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Success", `${type} added`, "success");
      fetchHierarchy();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const handleEdit = async (type, item, api) => {
    const { value: name } = await Swal.fire({
      title: `Edit ${type}`,
      input: "text",
      inputValue: item.name,
      showCancelButton: true,
    });
    if (!name) return;

    try {
      await axios.put(
        `/api/${api}/${item._id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Updated", `${type} updated`, "success");
      fetchHierarchy();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  const handleDelete = async (type, id, api) => {
    const result = await Swal.fire({
      title: `Delete ${type}?`,
      text: `This will remove the ${type.toLowerCase()}.`,
      icon: "warning",
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/${api}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted", `${type} removed`, "success");
      fetchHierarchy();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // ---------- UI ----------
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-full">
          <Layers className="text-blue-600" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Course  Manager
        </h1>
      </div>

      {/* Step 1: Courses */}
      {!selectedCourse && !selectedSubject && (
        <>
          <button
            onClick={() => handleAdd("Course")}
            className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
          >
            + Add Course
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition cursor-pointer p-5 flex flex-col justify-between"
              >
                <h3
                  className="font-semibold text-lg text-gray-800 hover:text-blue-600 mb-3"
                  onClick={() => setSelectedCourse(course)}
                >
                  {course.name}
                </h3>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit("Course", course, "courses")}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Edit2Icon size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("Course", course._id, "courses")
                    }
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2: Subjects */}
      {selectedCourse && !selectedSubject && (
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Subjects in {selectedCourse.name}
          </h2>
          <button
            onClick={() => handleAdd("Subject", selectedCourse)}
            className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
          >
            + Add Subject
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedCourse.subjects.map((subj) => (
              <div
                key={subj._id}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition cursor-pointer p-5 flex flex-col justify-between"
              >
                <h4
                  className="font-semibold text-lg text-gray-800 hover:text-blue-600 mb-3"
                  onClick={() => setSelectedSubject(subj)}
                >
                  {subj.name}
                </h4>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit("Subject", subj, "subjects")}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Edit2Icon size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("Subject", subj._id, "subjects")
                    }
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Categories */}
      {selectedCourse && selectedSubject && (
        <div>
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-4 flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Categories in {selectedSubject.name}
          </h2>
          <button
            onClick={() => handleAdd("Category", selectedSubject)}
            className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
          >
            + Add Category
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedSubject.categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                <h5 className="font-medium text-gray-800">{cat.name}</h5>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => handleEdit("Category", cat, "categories")}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  >
                    <Edit2Icon size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("Category", cat._id, "categories")
                    }
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await axios.put(
                          `/api/categories/${cat._id}`,
                          { isPublished: !cat.isPublished },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );

                        Swal.fire(
                          "Updated",
                          `Category has been ${
                            cat.isPublished ? "Unpublished" : "Published"
                          }`,
                          "success"
                        );

                        fetchHierarchy(); // refresh data
                      } catch (err) {
                        Swal.fire(
                          "Error",
                          err.response?.data?.message || err.message,
                          "error"
                        );
                      }
                    }}
                    className={`px-4 py-1.5 rounded-lg font-medium transition ${
                      cat.isPublished
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {cat.isPublished ? "Unpublish" : "Publish"}
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
