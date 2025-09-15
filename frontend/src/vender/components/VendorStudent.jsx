import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
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

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    grade: "",
    school: "",
    profileImage: null,
  });

  const token = sessionStorage.getItem("venderToken");

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/api/auth/${vendorId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.students);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input
  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      dob: "",
      grade: "",
      school: "",
      profileImage: null,
    });
    setEditingStudent(null);
  };

  // Add / Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) formDataObj.append(key, formData[key]);
      });

      if (editingStudent) {
        // ✅ Edit student
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
        // ✅ Add student
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Student Manager</h2>
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

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-4 text-left text-lg font-medium text-gray-700 border-b">
                  Profile
                </th>
                <th className="px-5 py-4 text-left text-lg font-medium text-gray-700 border-b">
                  Name
                </th>
                <th className="px-5 py-4 text-left text-lg font-medium text-gray-700 border-b hidden sm:table-cell">
                  Email 
                </th>
                <th className="px-5 py-4 text-left text-lg font-medium text-gray-700 border-b hidden xl:table-cell">
                  Phone
                </th>
                <th className="px-5 py-4 text-left text-lg font-medium text-gray-700 border-b hidden xl:table-cell">
                  Grade
                </th>
                <th className="px-5 py-4 text-center text-lg font-medium text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
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
                  <td className="px-3 py-2 border-b hidden sm:table-cell">
                    {s.email}
                  </td>
                  <td className="px-3 py-2 border-b hidden xl:table-cell">
                    {s.phone}
                  </td>
                  <td className="px-3 py-2 border-b hidden xl:table-cell">
                    {s.grade}
                  </td>
                  <td className="px-3 py-2  border-b flex justify-center space-x-2">
                    <button
                      onClick={() => setViewStudent(s)}
                      className=  "p-3 text-green-600 hover:text-green-700 p-2 rounded-md hover:bg-green-100/80 flex items-center justify-center"
                     
                      title="View Student"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setEditingStudent(s);
                        setFormData({
                          username: s.username,
                          email: s.email,
                          password: "",
                          phone: s.phone,
                          gender: s.gender,
                          dob: s.dob?.split("T")[0] || "",
                          grade: s.grade,
                          school: s.school,
                          profileImage: null,
                        });
                        setShowForm(true);
                      }}
                     className=
                     "p-3 text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-100/80 flex items-center justify-center"
                      title="Edit Student"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-3 text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-100/80 flex items-center justify-center"
                      title="Delete Student"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2  gap-4"
            >
              {/* Username */}
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>

              {/* Password (only on add) */}
              {!editingStudent && (
                <div>
                  <label className="block mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* DOB */}
              <div>
                <label className="block mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block mb-1">Grade</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Grade</option>
                  <option value="10th">10th</option>
                  <option value="11th">11th</option>
                  <option value="12th">12th</option>
                  <option value="College">College</option>
                </select>
              </div>

              {/* School */}
              <div>
                <label className="block mb-1">School</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Profile Image (full width) */}
              <div className="md:col-span-2">
                <label className="block mb-1">Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Buttons (full width) */}
              <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
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
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#02486e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Student Profile</h3>
              <button
                onClick={() => setViewStudent(null)}
                className="text-white text-xl font-bold hover:text-gray-200"
              >
                &times;
              </button>
            </div>

            {/* Profile Image */}
            {viewStudent.profileImage && (
              <div className="flex justify-center -mt-12 mb-4">
                <img
                  src={`/uploads/${viewStudent.profileImage}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 pb-6">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded shadow-lg">
                <FaUser className="text-[#004469] w-5 h-5" />
                <span className="font-medium">{viewStudent.username}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded shadow-lg">
                <FaEnvelope className="text-[#004469] w-5 h-5" />
                <span>{viewStudent.email}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded shadow-lg">
                <FaPhone className="text-[#004469] w-5 h-5" />
                <span>{viewStudent.phone}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded shadow-lg">
                <FaVenusMars className="text-[#004469] w-5 h-5" />
                <span>{viewStudent.gender}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded shadow-lg">
                <FaBirthdayCake className="text-[#004469] w-5 h-5" />
                <span>{viewStudent.dob?.split("T")[0]}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded shadow-lg">
                <FaGraduationCap className="text-[#004469] w-5 h-5" />
                <span>{viewStudent.grade}</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded shadow-xl col-span-2">
                <FaSchool className="text-[#004469] w-5 h-5" />
                <span>{viewStudent.school}</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end px-6 pb-4">
              <button
                onClick={() => setViewStudent(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
