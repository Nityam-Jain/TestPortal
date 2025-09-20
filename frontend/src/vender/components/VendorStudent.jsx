import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit2, Trash2, Eye } from "lucide-react";
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
    profileImage: null,
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
      profileImage: null,
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
      profileImage: null,
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
        }));

        try {
          await axios.post("/api/auth/students/bulk", csvStudents, {
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
        <div className="flex gap-2">
          <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">
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
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-4 text-left">Profile</th>
                  <th className="px-5 py-4 text-left">Name</th>
                  <th className="px-5 py-4 text-center hidden xl:table-cell">
                    Email
                  </th>
                  <th className="px-5 py-4 text-left hidden xl:table-cell">
                    Phone
                  </th>
                  <th className="px-5 py-4 text-center hidden xl:table-cell">
                    Academic Stage
                  </th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s) => (
                  <tr
                    key={s._id}
                    className="bg-white hover:bg-gray-50 transition"
                  >
                    <td className="p-2 border-b">
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
                    <td className="px-3 py-2 border-b font-medium">{s.username}</td>
                    <td className="px-3 py-2 border-b hidden xl:table-cell text-center">
                      {s.email}
                    </td>
                    <td className="px-3 py-2 border-b hidden xl:table-cell">{s.phone}</td>
                    <td className="px-3 py-2 border-b hidden xl:table-cell text-center">{s.grade}</td>
                    <td className="px-3 py-2 border-b flex justify-center space-x-2">
                      <button
                        onClick={() => setViewStudent(s)}
                        className="p-3 text-green-600 hover:bg-green-100/80"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => openEditForm(s)}
                        className="p-3 text-blue-600 hover:bg-blue-100/80"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-3 text-red-600 hover:bg-red-100/80"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
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
