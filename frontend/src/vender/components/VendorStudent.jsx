import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit2, Trash2, Eye, Search } from "lucide-react";
import Papa from "papaparse";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaBirthdayCake,
  FaGraduationCap,
  FaSchool,
} from "react-icons/fa";

export default function VendorStudentManager({ vendorId }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [availableStreams, setAvailableStreams] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ added

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    grade: "",
    institutionType: "School",
    institutionName: "",
    stream: "",
    profileImage: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10); // pagination

  const token = sessionStorage.getItem("venderToken");

  // Streams by grade
  const streamsForGrade = (grade) => {
    if (grade === "10th") return ["General"];
    if (grade === "11th" || grade === "12th")
      return ["PCB", "PCM", "Commerce", "Arts"];
    if (grade === "College")
      return ["B.Tech", "B.Com", "B.A", "B.Sc", "Other"];
    return [];
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/api/auth/${vendorId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Search students
  const searchStudents = async (query) => {
    if (!query.trim()) {
      fetchStudents(); // if empty, reload all students
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/users/search?query=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data || []);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // ✅ Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchStudents(value);
  };
  // Update streams on grade change
  const handleGradeChange = (gradeValue) => {
    const institutionType = gradeValue === "College" ? "College" : "School";
    const streams = streamsForGrade(gradeValue);
    const defaultStream = streams.length === 1 ? streams[0] : "";
    setAvailableStreams(streams);
    setFormData((prev) => ({
      ...prev,
      grade: gradeValue,
      institutionType,
      stream: defaultStream,
    }));
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digits }));
      return;
    }

    if (name === "grade") {
      handleGradeChange(value);
      return;
    }
    if (name === "profileImage" && files && files[0]) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      dob: "",
      grade: "",
      institutionType: "School",
      institutionName: "",
      stream: "",
      profileImage: "",
    });
    setAvailableStreams([]);
    setEditingStudent(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.grade) {
      Swal.fire("Validation", "Please select the grade.", "warning");
      return;
    }
    if (availableStreams.length > 0 && !formData.stream) {
      Swal.fire("Validation", "Please select the stream.", "warning");
      return;
    }
    if (!formData.institutionName) {
      Swal.fire(
        "Validation",
        `Please enter the ${formData.institutionType} name.`,
        "warning"
      );
      return;
    }

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== undefined &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          if (key === "password" && editingStudent) return;
          formDataObj.append(key, formData[key]);
        }
      });

      if (editingStudent) {
        await axios.put(
          `/api/auth/editStudent/${editingStudent._id}`,
          formDataObj,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire("Success", "Student updated successfully", "success");
      } else {
        await axios.post("/api/auth/students", formDataObj, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire("Success", "Student added successfully", "success");
      }

      setShowForm(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This student will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/auth/deleteStudent/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "Student deleted successfully", "success");
          fetchStudents();
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || err.message,
            "error"
          );
        }
      }
    });
  };

  // Edit form
  const openEditForm = (s) => {
    setEditingStudent(s);
    const streams = streamsForGrade(s.grade);
    setAvailableStreams(streams);

    setFormData({
      username: s.username || "",
      email: s.email || "",
      password: "",
      phone: s.phone || "",
      gender: s.gender || "",
      dob: s.dob?.split?.("T")[0] || "",
      grade: s.grade || "",
      institutionType:
        s.institutionType || (s.grade === "College" ? "College" : "School"),
      institutionName: s.institutionName || "",
      stream: s.stream || "",
      profileImage: s.profileImage || "",
    });

    setShowForm(true);
  };

  // CSV upload
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const csvStudents = results.data.map((row) => ({
          username: row.username || "",
          email: row.email || "",
          password: row.password || "123456",
          phone: row.phone || "",
          gender: row.gender || "",
          dob: row.dob || "",
          grade: row.grade || "",
          institutionType: row.grade === "College" ? "College" : "School",
          institutionName: row.institutionName || "",
          stream: row.stream || "",
          profileImage: row.profileImage || null,   // ✅ added
          vendorId: row.vendorId || null,
        }));

        try {
          await axios.post("/api/auth/students/bulk",
            { users: csvStudents },
            {
              headers: { Authorization: `Bearer ${token}` },
            });
          Swal.fire("Success", "CSV uploaded successfully", "success");
          fetchStudents();
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || err.message,
            "error"
          );
        }
      },
    });
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  return (
    <div className="p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold">Student Manager</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* ✅ Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, email, or institution..."
              className="border px-3 py-2 rounded w-full sm:w-72 pl-9"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div> <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">
            Upload CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleCSVUpload}
            />
          </label>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <>
          {/* <div className="p-4 md:p-6 bg-gray-50 min-h-screen"> */}
          {/* <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              All Students
            </h1> */}

          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-4 text-left font-medium text-gray-700 ">
                    Profile
                  </th>
                  <th className="px-5 py-4 text-left font-medium text-gray-700 ">
                    Name
                  </th>
                  <th className="px-5 py-4 text-center font-medium text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                    Email
                  </th>
                  <th className="px-5 py-4 text-left font-medium text-gray-700  hidden xl:table-cell">
                    Phone
                  </th>
                  <th className="px-5 py-4 text-center font-medium text-gray-700  hidden xl:table-cell">
                    Academic Stage
                  </th>
                  <th className="px-5 py-4 text-center font-medium text-gray-700 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentStudents.map((s) => (
                  <tr key={s._id} className="bg-white hover:bg-gray-50 transition">
                    <td className="px-3 py-3">
                      {s.profileImage ? (
                        <img
                          src={`/uploads/${s.profileImage}`}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-medium">{s.username}</td>
                    <td className="px-3 py-3 text-center hidden xl:table-cell">
                      {s.email}
                    </td>
                    <td className="px-3 py-3 hidden xl:table-cell">{s.phone}</td>
                    <td className="px-3 py-3 text-center hidden xl:table-cell">
                      {s.grade}
                    </td>
                    <td className="px-3 py-3 flex justify-center gap-3">
                      <button
                        onClick={() => setViewStudent(s)}
                        className="p-2 hover:bg-green-100/80 rounded"
                      >
                        <Eye size={20} className="text-green-600" />
                      </button>
                      <button
                        onClick={() => openEditForm(s)}
                        className="p-2 hover:bg-blue-100/80 rounded"
                      >
                        <Edit2 size={20} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-2 hover:bg-red-100/80 rounded"
                      >
                        <Trash2 size={20} className="text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* </div> */}


          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-end mt-6 pr-6 sticky bottom-0 bg-white py-3">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded mr-2 ${currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Prev
              </button>

              {/* Page Numbers with Ellipsis */}
              {(() => {
                const pages = [];
                for (let page = 1; page <= totalPages; page++) {
                  if (
                    page === 1 || // always show first
                    page === totalPages || // always show last
                    Math.abs(page - currentPage) <= 1 // current & neighbors
                  ) {
                    pages.push(
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded mx-1 ${currentPage === page
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    // insert ellipsis only once for a skipped range
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    pages.push(
                      <span key={`ellipsis-${page}`} className="px-2">
                        ...
                      </span>
                    );
                  }
                }
                return pages;
              })()}

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ml-2 ${currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Next
              </button>
            </div>
          )}


        </>
      )}




      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4"
            >
              {/* Row 1: Name + Email */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <label className="mb-1">Student Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Password (only for new) + Phone */}
              <div className="flex gap-4">
                {!editingStudent && (
                  <div className="flex flex-col w-1/2">
                    <label className="mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full border px-2 py-1 rounded"
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col w-1/2">
                  <label className="mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10 digit phone"
                    maxLength="10"
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                </div>
              </div>

              {/* Row 3: Gender + DOB + Grade */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/3">
                  <label className="mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col w-1/3">
                  <label className="mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label className="mb-1">Academic Stage</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                  >
                    <option value="">Select Academic Stage</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                    <option value="College">College</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Stream + Institution Name + Profile Image */}
              <div className="flex gap-4 items-end">
                <div className="flex flex-col w-1/3">
                  <label className="mb-1">Stream</label>
                  {availableStreams.length === 1 && availableStreams[0] === "General" ? (
                    <input
                      type="text"
                      name="stream"
                      value="General"
                      readOnly
                      className="w-full border px-2 py-1 rounded bg-gray-100 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 rounded"
                      required={availableStreams.length > 0}
                    >
                      <option value="">
                        {availableStreams.length > 0
                          ? "Select Stream"
                          : "Select Grade First"}
                      </option>
                      {availableStreams.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col w-1/3">
                  <label className="mb-1">{formData.institutionType} Name</label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder={`Enter ${formData.institutionType} name`}
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                </div>

                <div className="flex flex-col w-1/3">
                  <label className="mb-1">Profile Image</label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                  />
                  {/* {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-20 h-20 object-cover border rounded"
                    />
                  )} */}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {editingStudent ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {viewStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            <div className="bg-[#02486e] text-white px-6 py-4 flex justify-between">
              <h3 className="text-lg font-semibold">Student Profile</h3>
              <button
                onClick={() => setViewStudent(null)}
                className="text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {viewStudent.profileImage && (
              <div className="flex justify-center -mt-12 mb-4">
                <img
                  src={`/uploads/${viewStudent.profileImage}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 pb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <FaUser className="text-[#004469]" />
                <span>{viewStudent.username}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <FaEnvelope className="text-[#004469]" />
                <span>{viewStudent.email}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <FaPhone className="text-[#004469]" />
                <span>{viewStudent.phone}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <FaVenusMars className="text-[#004469]" />
                <span>{viewStudent.gender}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <FaBirthdayCake className="text-[#004469]" />
                <span>{viewStudent.dob?.split("T")[0]}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                <FaGraduationCap className="text-[#004469]" />
                <span>{viewStudent.grade}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded sm:col-span-2">
                <FaSchool className="text-[#004469]" />
                <div>
                  <div className="font-medium">
                    {viewStudent.institutionType}: {viewStudent.institutionName}
                  </div>
                  <div className="text-sm text-gray-600">
                    Stream: {viewStudent.stream || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
