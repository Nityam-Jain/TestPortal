import { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Briefcase, MapPin, FileText } from "lucide-react";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("adminToken");
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        All Vendors
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading vendors...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto border-separate border-spacing-0">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 uppercase tracking-wider">Sr.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 uppercase tracking-wider">Username</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 uppercase tracking-wider">Business Name</th>
                <th className="text-center px-4 py-3 font-medium text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.map((vendor, idx) => (
                <tr
                  key={vendor._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 border-b text-sm md:text-base">{idx + 1.}</td>
                  <td className="px-3 py-2 border-b text-sm md:text-base">{vendor.username}</td>
                  <td className="px-3 py-2 border-b text-sm md:text-base">{vendor.email}</td>
                  <td className="px-3 py-2 border-b text-sm md:text-base">{vendor.businessName}</td>
                  <td className="px-3 py-2 border-b text-center">
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className="bg-blue-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg hover:bg-blue-600 transition text-sm md:text-base"
                    >
                     View Profile
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
            
            {/* Header */}
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

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <User className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="text-sm md:text-base text-gray-500">Username</p>
                    <p className="font-medium text-sm md:text-base">{selectedVendor.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <Mail className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="text-sm md:text-base text-gray-500">Email</p>
                    <p className="font-medium text-sm md:text-base">{selectedVendor.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <Phone className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="text-sm md:text-base text-gray-500">Mobile</p>
                    <p className="font-medium text-sm md:text-base">{selectedVendor.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <Briefcase className="text-indigo-500 w-5 h-5" />
                  <div>
                    <p className="text-sm md:text-base text-gray-500">Business Name</p>
                    <p className="font-medium text-sm md:text-base">{selectedVendor.businessName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <MapPin className="text-orange-500 w-5 h-5" />
                  <div>
                    <p className="text-sm md:text-base text-gray-500">Address</p>
                    <p className="font-medium text-sm md:text-base">{selectedVendor.address || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <FileText className="text-pink-500 w-5 h-5" />
                  <div>
                    <p className="text-sm md:text-base text-gray-500">ID Proof</p>
                    <p className="font-medium text-sm md:text-base">{selectedVendor.idProofName} - {selectedVendor.idProofNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              {/* <button
                onClick={() => setSelectedVendor(null)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
