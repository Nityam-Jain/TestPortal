import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit2Icon, Trash2, ArrowLeft } from "lucide-react";

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
      <h1 className="text-2xl font-bold">Course Hierarchy Manager</h1>

      {/* Step 1: Courses */}
      {!selectedCourse && !selectedSubject && (
        <>
          <button
            onClick={() => handleAdd("Course")}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Course
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition cursor-pointer"
              >
                <h3
                  className="font-semibold text-lg mb-2"
                  onClick={() => setSelectedCourse(course)}
                >
                  {course.name}
                </h3>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleEdit("Course", course, "courses")}
                    className="p-3 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-100/80 flex items-center justify-center transition-colors"
                  >
                    <Edit2Icon size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("Course", course._id, "courses")
                    }
                    className="p-3 text-red-600 hover:text-red-700 rounded-md hover:bg-red-100/80 flex items-center justify-center transition-colors"
                    title="Delete"
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
            className="mb-4 flex items-center gap-1 bg-gray-200 px-4 py-2 rounded"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-xl font-semibold mb-3">
            Subjects in {selectedCourse.name}
          </h2>
          <button
            onClick={() => handleAdd("Subject", selectedCourse)}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Subject
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedCourse.subjects.map((subj) => (
              <div
                key={subj._id}
                className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition cursor-pointer"
              >
                <h4
                  className="font-semibold text-lg mb-2"
                  onClick={() => setSelectedSubject(subj)}
                >
                  {subj.name}
                </h4>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleEdit("Subject", subj, "subjects")}
                    className="p-3 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-100/80 flex items-center justify-center transition-colors"              >
                    <Edit2Icon size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("Subject", subj._id, "subjects")
                    }
                    className="p-3 text-red-600 hover:text-red-700 rounded-md hover:bg-red-100/80 flex items-center justify-center transition-colors"
                    title="Delete"                 >
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
            className="mb-4 flex items-center gap-1 bg-gray-200 px-4 py-2 rounded"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-xl font-semibold mb-3">
            Categories in {selectedSubject.name}
          </h2>
          <button
            onClick={() => handleAdd("Category", selectedSubject)}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Category
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedSubject.categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
              >
                <h5 className="font-medium">{cat.name}</h5>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit("Category", cat, "categories")}
                    className="p-3 text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-100/80 flex items-center justify-center transition-colors"                  >
                    <Edit2Icon size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete("Category", cat._id, "categories")
                    }
                    className="p-3 text-red-600 hover:text-red-700 rounded-md hover:bg-red-100/80 flex items-center justify-center transition-colors"
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
                          `Category has been ${cat.isPublished ? "Unpublished" : "Published"
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
                    className={`px-3 py-1 rounded font-medium transition ${cat.isPublished
                      ? "bg-red-500 hover:bg-red-600 text-white" // 🔴 Unpublish button
                      : "bg-green-500 hover:bg-green-600 text-white" // 🟢 Publish button
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
