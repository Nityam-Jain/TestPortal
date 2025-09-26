import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  FileText,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [editVendor, setEditVendor] = useState(null);

  const token = sessionStorage.getItem("adminToken");

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Delete Vendor
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
        await axios.delete(`/api/admin/vendors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "Vendor has been deleted.", "success");
        setVendors((prev) => prev.filter((v) => v._id !== id));
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to delete vendor",
          "error"
        );
      }
    }
  };

  // Open Edit Modal
  const handleEdit = (vendor) => {
    setEditVendor({ ...vendor }); // clone to allow editing
  };

  // Save Edited Vendor
  const handleSave = async () => {
    try {
      const { data } = await axios.put(
        `/api/admin/vendors/${editVendor._id}`,
        editVendor,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVendors((prev) =>
        prev.map((v) => (v._id === data._id ? data : v))
      );
      setEditVendor(null);
      Swal.fire("Updated!", "Vendor updated successfully.", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update vendor",
        "error"
      );
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        All Institutes
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading vendors...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                  Sr.
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                  Institute owner
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                 Institute Name
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-700 ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.map((vendor, idx) => (
                <tr
                  key={vendor._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 text-sm md:text-base">{idx + 1}.</td>
                  <td className="px-3 py-2 text-sm md:text-base">
                    {vendor.username}
                  </td>
                  <td className="px-3 py-2 text-sm md:text-base">{vendor.email}</td>
                  <td className="px-3 py-2 text-sm md:text-base">
                    {vendor.businessName}
                  </td>
                  <td className="px-3 py-2 text-center flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="p-3 hover:bg-green-100/80 rounded"
                    >
                      <Eye className="w-5 h-5 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(vendor)}
                      className="p-3 hover:bg-blue-100/80 rounded"
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(vendor._id)}
                      className="p-3 hover:bg-red-100/80 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 mb-6 gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" /> Vendor Profile
              </h2>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-gray-500 hover:text-gray-800 text-xl md:text-lg"
              >
                ✖
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <User className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Institute owner</p>
                    <p className="font-medium">{selectedVendor.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <Mail className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedVendor.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <Phone className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium">{selectedVendor.mobile}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <Briefcase className="text-indigo-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Institute Name</p>
                    <p className="font-medium">{selectedVendor.businessName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <MapPin className="text-orange-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedVendor.address || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <FileText className="text-pink-500 w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">ID Proof</p>
                    <p className="font-medium">
                      {selectedVendor.idProofName} - {selectedVendor.idProofNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {editVendor && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Vendor</h2>

            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={editVendor.username}
              onChange={(e) =>
                setEditVendor({ ...editVendor, username: e.target.value })
              }
            />

            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded mb-4"
              value={editVendor.email}
              onChange={(e) =>
                setEditVendor({ ...editVendor, email: e.target.value })
              }
            />

            <label className="block text-sm mb-1">Mobile</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={editVendor.mobile || ""}
              onChange={(e) =>
                setEditVendor({ ...editVendor, mobile: e.target.value })
              }
            />

            <label className="block text-sm mb-1">Address</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={editVendor.address || ""}
              onChange={(e) =>
                setEditVendor({ ...editVendor, address: e.target.value })
              }
            />

            <label className="block text-sm mb-1">Business Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              value={editVendor.businessName}
              onChange={(e) =>
                setEditVendor({ ...editVendor, businessName: e.target.value })
              }
            />

            {/* ID Proof Name Dropdown */}
            <label className="block text-sm mb-1">ID Proof Name</label>
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={editVendor.idProofName}
              onChange={(e) => setEditVendor({
                ...editVendor,
                idProofName: e.target.value,
                idProofNumber: "", // reset number when changing type
              })}
            >
              <option value="">Select Proof</option>
              <option value="Aadhar Card">Aadhar Card</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
            </select>

            {/* ID Proof Number Input */}
            <label className="block text-sm mb-1">ID Proof Number</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder={
                editVendor.idProofName === "Aadhar Card"
                  ? "Enter 12-digit Aadhar number"
                  : editVendor.idProofName === "PAN Card"
                    ? "Enter 10-character PAN number"
                    : editVendor.idProofName === "Passport"
                      ? "Enter Passport number"
                      : editVendor.idProofName === "Driving License"
                        ? "Enter Driving License number"
                        : "Enter ID number"
              }
              value={editVendor.idProofNumber}
              onChange={(e) => {
                let val = e.target.value;

                // Validation
                if (editVendor.idProofName === "Aadhar Card") {
                  val = val.replace(/\D/g, ""); 
                  if (val.length > 12) val = val.slice(0, 12);
                } else if (editVendor.idProofName === "PAN Card") {
                  val = val.toUpperCase();
                  if (val.length > 10) val = val.slice(0, 10);
                } else if (editVendor.idProofName === "Driving License") {
                  if (val.length > 16) val = val.slice(0, 16); // typical DL max length
                } else if (editVendor.idProofName === "Passport") {
                  if (val.length > 9) val = val.slice(0, 7); // typical Passport max length
                }

                setEditVendor({ ...editVendor, idProofNumber: val });
              }}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setEditVendor(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
