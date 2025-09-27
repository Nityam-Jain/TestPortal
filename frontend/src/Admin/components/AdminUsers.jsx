import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Calendar,
  School,
  BadgeCheck,
  UserCircle,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const token = sessionStorage.getItem("adminToken");

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // reverse so newest comes first
      setUsers(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "User has been deleted.", "success");
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to delete user",
          "error"
        );
      }
    }
  };

  // Open edit modal
  const handleEdit = (user) => {
    setEditUser({ ...user, password: "" });
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = editUser._id;
      const payload = { ...editUser };
      if (!payload.password) delete payload.password;

      const res = await axios.put(`/api/admin/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Success", "User updated successfully", "success");
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      setEditUser(null);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update user",
        "error"
      );
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Students</h2>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Sr.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">School/College</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Signup From</th>
                <th className="text-center px-4 py-3 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((u, i) => (
                <tr
                  key={u._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 text-sm md:text-base">
                    {startIndex + i + 1}
                  </td>
                  <td className="px-3 py-2 text-sm md:text-base">{u.username}</td>
                  <td className="px-3 py-2 text-sm md:text-base">{u.email}</td>
                  <td className="px-3 py-2 text-sm md:text-base">
                    {u.institutionName
                      ? `${u.institutionName} (${u.institutionType})`
                      : "N/A"}
                  </td>
                  <td className="px-1 py-1 text-sm md:text-base font-semibold">
                    <span
                      className={`px-1 py-0 rounded 
                    ${u.vendorId ? "bg-green-200 text-green-700" : "bg-blue-200 text-blue-700"}`}
                    >
                      {u.vendorId ? "Institute Panel" : "Student Panel"}
                    </span>
                  </td>


                  <td className="px-3 py-2 text-center flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="p-3 hover:bg-blue-100/80 rounded"
                    >
                      <Eye className="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(u)}
                      className="p-3 hover:bg-green-100/80 rounded"
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-3 hover:bg-red-100/80 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 p-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
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
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              Student Details
            </h3>
            <button
              className="absolute top-3 right-3 text-red-500 hover:text-red-600 font-bold text-xl"
              onClick={() => setSelectedUser(null)}
            >
              ✕
            </button>

            <div className="flex flex-col items-center mb-6 bg-gray-200 p-2 rounded-sm">
              {selectedUser.profileImage ? (
                <img
                  src={`/uploads/${selectedUser.profileImage}`}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <UserCircle className="w-28 h-28 text-gray-400" />
              )}
              <h1 className="mt-3 text-2xl font-bold text-gray-800">
                {selectedUser.username}
              </h1>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
              <p
                className={`text-sm font-medium px-3 py-1 mt-2 rounded-full 
      ${selectedUser.vendorId ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"}`}
              >
                {selectedUser.vendorId ? "Institute Panel" : "Student Panel"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <User className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <Mail className="text-green-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <Phone className="text-purple-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <Calendar className="text-orange-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">DOB</p>
                  <p className="font-medium">
                    {new Date(selectedUser.dob).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <School className="text-indigo-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">
                    {selectedUser.institutionType}
                  </p>
                  <p className="font-medium">{selectedUser.institutionName}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <BadgeCheck className="text-pink-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{selectedUser.gender}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <BadgeCheck className="text-yellow-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Academic Stage</p>
                  <p className="font-medium">{selectedUser.grade}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
                <BadgeCheck className="text-teal-500 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Stream</p>
                  <p className="font-medium">{selectedUser.stream}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <h3 className="text-2xl font-bold mb-6">Edit User</h3>
            <button
              className="absolute top-3 right-3 text-red-500 hover:text-red-600 font-bold text-xl"
              onClick={() => setEditUser(null)}
            >
              ✕
            </button>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Username</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.phone}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                  pattern="[0-9]{10}"
                  title="Phone number must be 10 digits"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">DOB</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={new Date(editUser.dob).toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEditUser({ ...editUser, dob: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Gender</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.gender}
                  onChange={(e) =>
                    setEditUser({ ...editUser, gender: e.target.value })
                  }
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Institution Type</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.institutionType}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      institutionType: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Type</option>
                  <option value="School">School</option>
                  <option value="College">College</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Institution Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.institutionName}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      institutionName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Academic Stage</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.grade}
                  onChange={(e) =>
                    setEditUser({ ...editUser, grade: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Stream</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={editUser.stream}
                  onChange={(e) =>
                    setEditUser({ ...editUser, stream: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-2"
              >
                Update User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
