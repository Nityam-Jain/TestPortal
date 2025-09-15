import { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, Calendar, School, BadgeCheck, UserCircle } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        const res = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
    <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gray-100 text-gray-700 text-left">
      <th className="border-b px-5 py-2">SR.</th>
      <th className="border-b px-5 py-2">Username</th>
      <th className="border-b px-5 py-2">Email</th>
      <th className="border-b px-5 py-2">College</th>
      <th className="border-b px-5 py-2 text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {users.map((u, i) => (
      <tr
        key={u._id}
        className="bg-gray-50 transition"
      > 
        <td className="border-b px-5 py-3">{i + 1}</td>
        <td className="border-b px-5 py-3">{u.username}</td>
        <td className="border-b px-5 py-3">{u.email}</td>
        <td className="border-b px-5 py-3">{u.school}</td>
        <td className="border-b px-5 py-3 text-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm"
            onClick={() => setSelectedUser(u)}
          >
            View Profile
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Modal for user details */}
 
{selectedUser && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
         User Details
      </h3>
      <button
        className="absolute top-3 right-3 text-red-500 hover:text-red-600 font-bold text-xl"
        onClick={() => setSelectedUser(null)}
      >
        ✕
      </button>

      {/* Profile Image */}
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
</div>



      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <User className="text-blue-500 w-5 h-5" />
          <div>
            <p className="text-sm text-gray-500">Username</p>
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
            <p className="text-sm text-gray-500">School</p>
            <p className="font-medium">{selectedUser.school}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <BadgeCheck className="text-pink-500 w-5 h-5" />
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{selectedUser.gender}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
